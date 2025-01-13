import { expect } from 'chai';
import { getAppPage } from "../../service/loginSetup.mjs";
import { generateDuplicateMercantilForm, cnpj, uuid } from '../../helpers/mock.js';
import { TIME, SLUG, PROTOCOL_STATUS, SERVICES, BASE_URL, ROUTE, PER_PAGE } from '../../config/constant.mjs';
import { searchById } from '../../service/duplicateMercantilService/searchById.mjs'
import { create } from '../../service/duplicateMercantilService/create.mjs'
import { searchByWallet, searchByWalletNotFound } from '../../service/duplicateMercantilService/searchByWallet.mjs'
import { findWalletsParticipant, searchWalletsParticipant } from '../../service/duplicateMercantilService/searchByWalletParticipant.mjs'

import protocolLogger from '../../service/ProtocolCSVLogger.js';
import ApiInterfaceService from '../../core/api-de-interface-clientes.js';
import { Utils } from '../../helpers/Utils.js';
import { DataTableService } from '../../service/DataTableService.mjs';


let duplicate;

describe("Duplicate Mercantil Test", function () {

    before(async () => {
        duplicate = (await ApiInterfaceService.findDuplicates(SLUG.DUPLICATE_MERCANTIL_SLUG))[0];
    });

    Object.entries(PER_PAGE).forEach(([key, value]) => {
        it(`Must change the number of records per page: PerPage: ${value}`, async () => {
            const page = await getAppPage();
            const { quantity, message } = await DataTableService.perPage(
                page,
                value,
                ROUTE.DUPLICATE_MERCANTIL_SEARCH_BASE
            );

            expect(quantity).to.equal(value);
            expect(message).to.include(`Exibindo ${value} registros por página`);
        });
    });

    it('Must navigate to next page', async () => {
        const page = await getAppPage();

        const isPreviousEnabled = await DataTableService.goToNextPage(page, ROUTE.DUPLICATE_MERCANTIL_SEARCH_BASE);
        expect(isPreviousEnabled).to.be.true;
    });

    it('Must load a specific page', async () => {
        const page = await getAppPage();
        const isLoaded = await DataTableService.goToPage(page, 2, ROUTE.DUPLICATE_MERCANTIL_SEARCH_BASE);
        expect(isLoaded).to.be.true;
    });

    it('Must check CSV download', async () => {
        const page = await getAppPage();
    
        const isDownload = await DataTableService.verifyLoadingCsv(page, ROUTE.DUPLICATE_MERCANTIL_SEARCH_BASE);
        expect(isDownload).to.be.true;
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

    it.skip('Should fill out all form fields and submit for registration', async () => {
        const page = await getAppPage();
        const formData = generateDuplicateMercantilForm();

        formData.mainParticipantCnpj = duplicate.main_participant_cnpj;
        formData.wallet = duplicate.wallet;

        const { successMessage, protocolData } = await create(page, formData);
        expect(successMessage).to.include('Duplicata Mercantil enviada para registro com sucesso!');
        expect(protocolData).to.not.be.null;

        protocolLogger.addProtocol(protocolData, PROTOCOL_STATUS.FINISHED, SERVICES.DUPLICATE_MERCANTIL);
    })

    it.skip('Should fill out all form fields and submit for registration: (ADD PAYMENT)', async () => {
        const page = await getAppPage();
        const formData = generateDuplicateMercantilForm();
        const route = `${BASE_URL}duplicate-mercantil/liquidations/${duplicate.asset_uuid}/create`

        const { successMessage, protocolData } = await Utils.liquidationAddPayment(page, route, formData);

        expect(successMessage).to.include('Protocolo para liquidação criado com sucesso');
        expect(protocolData).to.not.be.null;

        protocolLogger.addProtocol(protocolData, PROTOCOL_STATUS.FINISHED, SERVICES.LIQUIDATION_DUPLICATE_MERCANTIL);
    })
})




