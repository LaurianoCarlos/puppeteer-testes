import { expect } from 'chai';
import { TIME, PROTOCOL_STATUS, SERVICES, BASE_URL } from '../../config/constant.mjs';
import { uuid, cnpj, generateServiceDuplicateForm } from '../../helpers/mock.js';
import { SLUG } from '../../config/constant.mjs';
import { getAppPage } from "../../service/loginSetup.mjs";
import { searchById } from "../../service/serviceDuplicateService/searchById.mjs";
import { searchByWallet, searchByWalletNotFound } from "../../service/serviceDuplicateService/searchByWallet.mjs";
import { findWalletsParticipant, searchWalletsParticipant } from "../../service/serviceDuplicateService/searchByWalletParticipant.mjs";
import { create } from "../../service/serviceDuplicateService/create.mjs";

import protocolLogger from '../../service/ProtocolCSVLogger.js';
import ApiInterfaceService from '../../core/api-de-interface-clientes.js';
import { Utils } from '../../helpers/Utils.js';

let duplicate;

describe("Service Duplicate Test", function () {
    this.timeout(TIME.FOUR_MINUTES);
    before(async () => {
        duplicate = (await ApiInterfaceService.findDuplicates(SLUG.DUPLICATE_SERVICE_SLUG))[0];
    });

    it('Should find a Service Duplicate by ID', async () => {
        const page = await getAppPage();
        const results = await searchById(page, duplicate.asset_uuid);

        expect(results.some(result => result.includes(duplicate.asset_uuid))).to.be.true;
    });

    it('Should not find a Service Duplicate by ID', async () => {
        const page = await getAppPage();
        const duplicateId = uuid();
        const results = await searchById(page, duplicateId);
        expect(results.some(result => result.includes(duplicateId))).to.be.false;
    });

    it('Should find a Mercantile Duplicate by Wallet', async () => {
        const page = await getAppPage();
        const { results, message } = await searchByWallet(page, duplicate.wallet);
        expect(results).to.not.be.null;
        expect(message).to.be.oneOf([
            'Duplicata de Serviço encontrada com sucesso.',
        ]);
    });

    it('Should not find a Mercantile Duplicate by Wallet', async () => {

        const page = await getAppPage();
        const walletUuid = uuid();
        const { message: message } = await searchByWalletNotFound(page, walletUuid);

        expect(message).to.be.oneOf([
            'Não foram encontradas duplicatas na carteira informada!',
        ]);
    });

    it('Should search and return no wallets for the participant', async () => {
        const page = await getAppPage();
        const { message } = await searchWalletsParticipant(page, cnpj());
        expect(message).to.be.oneOf([
            'Participante não encontrado ou sem permissão para esse usuário',
            'Não existe carteiras para esse participante',
        ]);
    });

    it('Should search and return available wallets for the participant', async () => {
        const page = await getAppPage();
        const wallets = await findWalletsParticipant(page, duplicate.main_participant_cnpj);
        expect(wallets).to.be.an('array').that.is.not.empty;
    });

    it('Should fill out all form fields and submit for registration', async () => {
        const page = await getAppPage();
        const formData = generateServiceDuplicateForm();

        formData.mainParticipantCnpj = duplicate.main_participant_cnpj;
        formData.wallet = duplicate.wallet;

        const { successMessage, protocolData } = await create(page, formData);
        expect(successMessage).to.include('Duplicata de Serviço enviada para registro com sucesso!');
        expect(protocolData).to.not.be.null;

        protocolLogger.addProtocol(protocolData, PROTOCOL_STATUS.FINISHED, SERVICES.SERVICE_DUPLICATE);
    })

    it.only('Should fill out all form fields and submit for registration: (ADD PAYMENT)', async () => {
        const page = await getAppPage();
        const formData = generateServiceDuplicateForm();
        const route = `${BASE_URL}service-duplicate/liquidations/${duplicate.asset_uuid}/create`

        const { successMessage, protocolData } = await Utils.liquidationAddPayment(page, route, formData);
      
        expect(successMessage).to.include('Protocolo para liquidação criado com sucesso');
        expect(protocolData).to.not.be.null;

        protocolLogger.addProtocol(protocolData, PROTOCOL_STATUS.FINISHED, SERVICES.LIQUIDATION_SERVICE_DUPLICATE);
    })

});
