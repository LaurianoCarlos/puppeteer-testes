import { expect } from 'chai';
import { TIME, PROTOCOL_STATUS, SERVICES, BASE_URL } from '../../config/constant.mjs';
import { uuid, cnpj, generateContratoMercantilForm } from '../../helpers/mock.js';
import { SLUG } from '../../config/constant.mjs';
import { getAppPage } from "../../service/loginSetup.mjs";
import { searchById } from "../../service/contractMercantilService/searchById.mjs";
import { searchByWallet, searchByWalletNotFound } from "../../service/contractMercantilService/searchByWallet.mjs";
import { findWalletsParticipant, searchWalletsParticipant } from "../../service/contractMercantilService/searchByWalletParticipant.mjs";
import { create } from "../../service/contractMercantilService/create.mjs";

import protocolLogger from '../../service/ProtocolCSVLogger.js';
import ApiInterfaceService from '../../core/api-de-interface-clientes.js';
import { Utils } from '../../helpers/Utils.js';

let contract;

describe("Contract Mercantil Test", function () {
    this.timeout(TIME.FOUR_MINUTES);
    before(async () => {
        protocolLogger.reset();
        contract = (await ApiInterfaceService.findDuplicates(SLUG.CONTRACT_MERCANTIL_SLUG))[0];
    });

    it('Should find a Contract Mercantil by ID', async () => {
        const page = await getAppPage();
        const results = await searchById(page, contract.asset_uuid);

        expect(results.some(result => result.includes(contract.asset_uuid))).to.be.true;
    });

    it('Should not find a Contract Mercantil by ID', async () => {
        const page = await getAppPage();
        const duplicateId = uuid();
        const results = await searchById(page, duplicateId);
        expect(results.some(result => result.includes(duplicateId))).to.be.false;
    });

    it('Should find a Contract Mercantil by Wallet', async () => {
        const page = await getAppPage();
        const { results, message } = await searchByWallet(page, contract.wallet);
        expect(results).to.not.be.null;
        expect(message).to.be.oneOf([
            'Contrato Mercantil encontrado com sucesso.',
        ]);
    });

    it('Should not find a Contract Mercantil by Wallet', async () => {
        const page = await getAppPage();
        const walletUuid = uuid();
        const { message: message } = await searchByWalletNotFound(page, walletUuid);

        expect(message).to.be.oneOf([
           'Não foram encontrados Contratos na carteira informada!'
        ]);
    });

    it('Should search and return available wallets for the participant', async () => {
        const page = await getAppPage();
        const wallets = await findWalletsParticipant(page, contract.main_participant_cnpj);
        expect(wallets).to.be.an('array').that.is.not.empty;
    });

    it('Should search and return no wallets for the participant', async () => {
        const page = await getAppPage();
        const { message } = await searchWalletsParticipant(page, cnpj());
       
        expect(message).to.be.oneOf([
            'Participante não encontrado ou sem permissão para esse usuário',
            'Não existe carteiras para esse participante',
        ]);
    });

    it('Should fill out all form fields and submit for registration', async () => {
        const page = await getAppPage();
        const formData = generateContratoMercantilForm();
    
        formData.mainParticipantCnpj = contract.main_participant_cnpj;
        formData.wallet = contract.wallet;

        const { successMessage, protocolData } = await create(page, formData);
        expect(successMessage).to.include('Contrato Mercantil enviado para registro com sucesso!');
        expect(protocolData).to.not.be.null;

        protocolLogger.addProtocol(protocolData, PROTOCOL_STATUS.FINISHED, SERVICES.CONTRACT_MERCANTIL);
    })

    it('Should fill out all form fields and submit for registration: (ADD PAYMENT)', async () => {
        const page = await getAppPage();
        const formData = generateContratoMercantilForm();
        const route = `${BASE_URL}mercantil-contract/liquidations/${contract.asset_uuid}/create`

        const { successMessage, protocolData } = await Utils.liquidationAddPayment(page, route, formData);
      
        expect(successMessage).to.include('Protocolo para liquidação criado com sucesso');
        expect(protocolData).to.not.be.null;

        protocolLogger.addProtocol(protocolData, PROTOCOL_STATUS.FINISHED, SERVICES.LIQUIDATION_CONTRACT_MERCANTIL);
    })
});
