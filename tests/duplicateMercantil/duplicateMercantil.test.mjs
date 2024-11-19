import { expect } from 'chai';
import { closeBrowser, getAppPage } from "../../service/loginSetup.mjs";
import { generateDuplicateMercantilForm, cnpj, uuid } from '../../helpers/mock.js';
import { TIME, SLUG, PROTOCOL_STATUS, SERVICES } from '../../config/constant.mjs';
import { searchById } from '../../service/duplicateMercantilService/searchById.mjs'
import { createDuplicateMercantil } from '../../service/duplicateMercantilService/create.mjs'
import { searchByWallet, searchByWalletNotFound } from '../../service/duplicateMercantilService/searchByWallet.mjs'
import { findWalletsParticipant, searchWalletsParticipant } from '../../service/duplicateMercantilService/searchByWalletParticipant.mjs'

import protocolLogger from'../../service/ProtocolCSVLogger.js';
import ApiInterfaceService  from '../../core/api-de-interface-clientes.js';

let duplicate;

describe("Test Duplicate Mercantil", function () {
    this.timeout(TIME.ONE_MINUTE);

    before(async () => {
        duplicate = (await ApiInterfaceService.findDuplicates(SLUG.DUPLICATE_MERCANTIL_SLUG))[0];
    });

    after(async () => {
        await closeBrowser();
    });

    it('Should find a Mercantile Duplicate by ID', async () => {
        const page = await getAppPage();
        const results = await searchById(page, duplicate.asset_uuid);
        expect(results.some(result => result.includes(duplicate.asset_uuid))).to.be.true;
    });

    it('Should not find a Mercantile Duplicate by ID', async () => {
        const page = await getAppPage();
        const duplicateUuid = uuid();
        const results = await searchById(page, duplicateUuid);
        expect(results.some(result => result.includes(duplicateUuid))).to.be.false;
    });

    it('Should find a Mercantile Duplicate by Wallet', async () => {
        const page = await getAppPage();
        const { results, message } = await searchByWallet(page, duplicate.wallet);
        expect(results).to.not.be.null;
        expect(message).to.be.oneOf([
            'Duplicata Mercantil encontrada com sucesso.',
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
        const { message } = await searchWalletsParticipant(page,  cnpj());
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
        const formData = generateDuplicateMercantilForm();
        formData.mainParticipantCnpj = duplicate.main_participant_cnpj;
        formData.wallet = duplicate.wallet;

        const { successMessage, protocolData } = await createDuplicateMercantil(page, formData);
        expect(successMessage).to.include('Duplicata Mercantil enviada para registro com sucesso!');
        expect(protocolData).to.not.be.null;

        protocolLogger.addProtocol(protocolData, PROTOCOL_STATUS.OPENED, SERVICES.DUPLICATE_MERCANTIL);
    })
})



