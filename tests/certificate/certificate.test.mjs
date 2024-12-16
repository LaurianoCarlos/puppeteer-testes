import { expect } from 'chai';
import { uuid } from '../../helpers/mock.js';
import { getAppPage } from "../../service/loginSetup.mjs";
import { PROTOCOL_STATUS, SERVICES } from '../../config/constant.mjs';
import { searchByActive } from '../../service/certificateService/searchByActive.mjs';
import { searchByWallet } from '../../service/certificateService/searchByWallet.mjs';
import { requestCertificateById } from '../../service/certificateService/requestCerticate.mjs';
import { requestCertificateByWallet } from '../../service/certificateService/requestCerticateByWallet.mjs';

import protocolLogger from '../../service/ProtocolCSVLogger.js';
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

    Object.entries(actives).forEach(([key, asset]) => {
        it(`Must find a certificate for the ${asset.toUpperCase()} asset`, async () => {
            const page = await getAppPage();
            const results = await searchByActive(page, asset);

            expect(results).to.not.be.null;
            expect(results.some(result => result.includes(asset.toUpperCase()))).to.be.true;
        });
    });


    Object.entries(actives).forEach(([key, asset]) => {
        it(`Must find a certificate for the ${asset.toUpperCase()} asset`, async () => {
            const page = await getAppPage();
            const results = await searchByWallet(page, asset);

            expect(results).to.not.be.null;
            expect(results.some(result => result.includes(asset.toUpperCase()))).to.be.true;
        });
    });


    Object.entries(actives).forEach(([key, asset]) => {
        it(`Should fill out all form fields and submit for registration (By ID): ${key}`, async () => {
            const page = await getAppPage();

            const protocolData = await requestCertificateById(page, asset, uuid());
            expect(protocolData).to.not.be.null;

            protocolLogger.addProtocol(protocolData, PROTOCOL_STATUS.FINISHED, SERVICES.CERTIFICATE);
        });
    });

    Object.entries(actives).forEach(([key, asset], index) => {
        it(`Should fill out all form fields and submit for registration (By ACTIVE): ${key}`, async () => {
            const page = await getAppPage();
            const wallet = wallets[index % wallets.length];

            const protocolData = await requestCertificateByWallet(page, asset, wallet);
            expect(protocolData).to.not.be.null;

            protocolLogger.addProtocol(protocolData, PROTOCOL_STATUS.FINISHED, SERVICES.CERTIFICATE);
        });
    });

});
