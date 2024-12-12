import { expect } from 'chai';
import { TIME, PROTOCOL_STATUS, SERVICES } from '../../config/constant.mjs';
import { uuid, mockFormData } from '../../helpers/mock.js';
import { SLUG } from '../../config/constant.mjs';
import { getAppPage } from "../../service/loginSetup.mjs";
import { searchById } from "../../service/cprService/searchById.mjs";
import { searchByProduct } from "../../service/cprService/searchByProduct.mjs";
import { searchByWallet, searchByWalletNotFound } from "../../service/cprService/searchByWallet.mjs";
import { create } from "../../service/cprService/create.mjs";

import protocolLogger from '../../service/ProtocolCSVLogger.js';
import ApiInterfaceService from '../../core/api-de-interface-clientes.js';

let cpr;

describe("CPR Test", function () {
    this.timeout(TIME.FOUR_MINUTES);

    before(async () => {
        cpr = (await ApiInterfaceService.findListByParticipant(SLUG.CPR_SLUG))[0];
    });

    it('Should find a CPR by ID', async () => {
        const page = await getAppPage();
        const results = await searchById(page, cpr.achievement_id);
        expect(results.some(result => result.includes(cpr.achievement_id))).to.be.true;
    });

    it('Should not find a CPR by ID', async () => {
        const page = await getAppPage();
        const duplicateId = uuid();
        const results = await searchById(page, duplicateId);
        expect(results.some(result => result.includes(duplicateId))).to.be.false;
    });

    it.skip('Should find a CPR by Wallet', async () => {
        const page = await getAppPage();
        const { results, message } = await searchByWallet(page, cpr.wallet);
        expect(results).to.not.be.null;
        expect(message).to.be.oneOf([
            'CPR encontrado com sucesso.',
        ]);
    });

    it('Should not find a CPR by Wallet', async () => {
        const page = await getAppPage();
        const walletUuid = uuid();
        const { message } = await searchByWalletNotFound(page, walletUuid);
        expect(message).to.be.oneOf([
            'Não foram encontradas cpr na carteira informada!'
        ]);
    });

    it('Should not find a CPR by Product', async () => {
        const page = await getAppPage(); 
        const productQuery = 'arroz';
        const { modalContent } = await searchByProduct(page, productQuery);
    
        const noResultsMessage = 'ARROZ';
        expect(modalContent).to.include(noResultsMessage);
    });
    

    it('Should fill out all form fields and submit for registration', async () => {
        const page = await getAppPage();
        const formData = mockFormData();
        formData.wallet = cpr.wallet;

        const { successMessage, protocolData } = await create(page, formData);

        expect(successMessage).to.include('CPR enviada para registro com sucesso!');
        expect(protocolData).to.not.be.null;

        protocolLogger.addProtocol(protocolData, PROTOCOL_STATUS.OPENED, SERVICES.CPR);
    });

    it('You must fill in the fields, except green CPR, and send it for registration', async () => {
        const page = await getAppPage();
        const formData = mockFormData();
        formData.wallet = cpr.wallet;

        const { successMessage, protocolData } = await create(page, formData, false);

        expect(successMessage).to.include('CPR enviada para registro com sucesso!');
        expect(protocolData).to.not.be.null;

        protocolLogger.addProtocol(protocolData, PROTOCOL_STATUS.FINISHED, SERVICES.CPR);
    });
});
