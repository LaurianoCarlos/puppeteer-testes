import { expect } from 'chai';
import { searchByActive } from '../../service/certificateService/searchByActive.mjs';
import { searchByWallet } from '../../service/certificateService/searchByWallet.mjs';
import { getAppPage } from "../../service/loginSetup.mjs";
import { requestCertificateById } from '../../service/certificateService/requestCerticate.mjs';
import { uuid } from '../../helpers/mock.js';
import { PROTOCOL_STATUS, SERVICES } from '../../config/constant.mjs';
import protocolLogger from '../../service/ProtocolCSVLogger.js';
import { requestCertificateByWallet } from '../../service/certificateService/requestCerticateByWallet.mjs';

import ApiInterfaceService from '../../core/api-de-interface-clientes.js';


let wallets;

before(async () => {
    const search = await ApiInterfaceService.getWallets();
    wallets = search.map(wallet => wallet.wallet_id);
    expect(wallets).to.not.be.empty;
});

describe("Certificate Test", function () {

    const actives = {
        UR: 'ur',
        CPR: 'cpr',
        CONTRACT_MERCANTIL: 'contrato-mercantil',
        DUPLICATE_SERVICE: 'duplicata-de-servico',
        DUPLICATE_MERCANTIL: 'duplicata-mercantil',
    }
    
    it('Must find a certificate for the Contract Mercantil asset', async () => {
        const page = await getAppPage();
        const results = await searchByActive(page, actives.CONTRACT_MERCANTIL);
    
        expect(results).to.not.be.null;
        expect(results.some(result => result.includes('CONTRATO-MERCANTIL'))).to.be.true;
    });

    it('Must find a certificate for the Duplicate Mercantil asset', async () => {
        const page = await getAppPage();
        const results = await searchByActive(page, actives.DUPLICATE_MERCANTIL);
    
        expect(results).to.not.be.null;
        expect(results.some(result => result.includes('DUPLICATA-MERCANTIL'))).to.be.true;
    });

    it('Must find a certificate for the Service Duplicate asset', async () => {
        const page = await getAppPage();
        const results = await searchByActive(page, actives.DUPLICATE_SERVICE);
    
        expect(results).to.not.be.null;
        expect(results.some(result => result.includes('DUPLICATA-DE-SERVICO'))).to.be.true;
    });

    it('Must find a certificate for the UR asset', async () => {
        const page = await getAppPage();
        const results = await searchByActive(page, actives.UR);
    
        expect(results).to.not.be.null;
        expect(results.some(result => result.includes('UR'))).to.be.true;
    });

    it('Must find a certificate for the CPR asset', async () => {
        const page = await getAppPage();
        const results = await searchByActive(page, actives.CPR);
    
        expect(results).to.not.be.null;
        expect(results.some(result => result.includes('CPR'))).to.be.true;
    });


    it('Must find a certificate  by Wallet for the Contract Mercantil asset', async () => {
        const page = await getAppPage();
        const results = await searchByWallet(page, actives.CONTRACT_MERCANTIL);
    
        expect(results).to.not.be.null;
        expect(results.some(result => result.includes('CONTRATO-MERCANTIL'))).to.be.true;
    });

    it('Must find a certificate  by Wallet for the Duplicate Mercantil asset', async () => {
        const page = await getAppPage();
        const results = await searchByWallet(page, actives.DUPLICATE_MERCANTIL);
    
        expect(results).to.not.be.null;
        expect(results.some(result => result.includes('DUPLICATA-MERCANTIL'))).to.be.true;
    });

    it('Must find a certificate  by Wallet for the Service Duplicate asset', async () => {
        const page = await getAppPage();
        const results = await searchByWallet(page, actives.DUPLICATE_SERVICE);
    
        expect(results).to.not.be.null;
        expect(results.some(result => result.includes('DUPLICATA-DE-SERVICO'))).to.be.true;
    });

    it('Must find a certificate  by Wallet for the UR asset', async () => {
        const page = await getAppPage();
        const results = await searchByWallet(page, actives.UR);
    
        expect(results).to.not.be.null;
        expect(results.some(result => result.includes('UR'))).to.be.true;
    });

    it('Must find a certificate  by Wallet for the CPR asset', async () => {
        const page = await getAppPage();
        const results = await searchByWallet(page, actives.CPR);
    
        expect(results).to.not.be.null;
        expect(results.some(result => result.includes('CPR'))).to.be.true;
    });

    it('Should fill out all form fields and submit for registration', async () => {
        const page = await getAppPage();

        const protocolData = await requestCertificateById(page, actives.CPR, uuid());
        expect(protocolData).to.not.be.null;

        protocolLogger.addProtocol(protocolData, PROTOCOL_STATUS.FINISHED, SERVICES.CERTIFICATE);
    })

    it('Should fill out all form fields and submit for registration: CPR', async () => {
        const page = await getAppPage();
        const search = await ApiInterfaceService.getWallets();
        const wallet = search[0].wallet_id;

        const protocolData = await requestCertificateByWallet(page, actives.CPR, wallet);
        expect(protocolData).to.not.be.null;

        protocolLogger.addProtocol(protocolData, PROTOCOL_STATUS.FINISHED, SERVICES.CERTIFICATE);
    })

    it('Should fill out all form fields and submit for registration: DUPLICATE MERCANTIL', async () => {
        const page = await getAppPage();
        const search = await ApiInterfaceService.getWallets();
        const wallet = search[0].wallet_id;

        const protocolData = await requestCertificateByWallet(page, actives.DUPLICATE_MERCANTIL, wallet);
        expect(protocolData).to.not.be.null;

        protocolLogger.addProtocol(protocolData, PROTOCOL_STATUS.FINISHED, SERVICES.CERTIFICATE);
    })

    Object.entries(actives).forEach(([key, asset], index) => {
        it.only(`Should fill out all form fields and submit for registration: ${key}`, async () => {
            const page = await getAppPage();
            const wallet = wallets[index % wallets.length];
    
            const protocolData = await requestCertificateByWallet(page, asset, wallet);
            expect(protocolData).to.not.be.null;
    
            protocolLogger.addProtocol(protocolData, PROTOCOL_STATUS.FINISHED, SERVICES.CERTIFICATE);
        });
    });
    
});
