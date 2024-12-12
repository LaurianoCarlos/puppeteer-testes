import { expect } from 'chai';
import { TIME } from '../../config/constant.mjs';
import { searchByActive } from '../../service/certificateService/searchByActive.mjs';
import { searchByWallet } from '../../service/certificateService/searchByWallet.mjs';
import { getAppPage } from "../../service/loginSetup.mjs";

const actives = {
    UR: 'ur',
    CPR: 'cpr',
    CONTRACT_MERCANTIL: 'contrato-mercantil',
    DUPLICATE_SERVICE: 'duplicata-de-servico',
    DUPLICATE_MERCANTIL: 'duplicata-mercantil',
}

describe("Certificate Test", function () {
    this.timeout(TIME.FOUR_MINUTES);

    it.only('Must find a certificate for the Contract Mercantil asset', async () => {
        const page = await getAppPage();
        const results = await searchByActive(page, actives.CONTRACT_MERCANTIL);
    
        expect(results).to.not.be.null;
        expect(results.some(result => result.includes('CONTRATO-MERCANTIL'))).to.be.true;
    });

    it.only('Must find a certificate for the Duplicate Mercantil asset', async () => {
        const page = await getAppPage();
        const results = await searchByActive(page, actives.DUPLICATE_MERCANTIL);
    
        expect(results).to.not.be.null;
        expect(results.some(result => result.includes('DUPLICATA-MERCANTIL'))).to.be.true;
    });

    it.only('Must find a certificate for the Service Duplicate asset', async () => {
        const page = await getAppPage();
        const results = await searchByActive(page, actives.DUPLICATE_SERVICE);
    
        expect(results).to.not.be.null;
        expect(results.some(result => result.includes('DUPLICATA-DE-SERVICO'))).to.be.true;
    });

    it.only('Must find a certificate for the UR asset', async () => {
        const page = await getAppPage();
        const results = await searchByActive(page, actives.UR);
    
        expect(results).to.not.be.null;
        expect(results.some(result => result.includes('UR'))).to.be.true;
    });

    it.only('Must find a certificate for the CPR asset', async () => {
        const page = await getAppPage();
        const results = await searchByActive(page, actives.CPR);
    
        expect(results).to.not.be.null;
        expect(results.some(result => result.includes('CPR'))).to.be.true;
    });


    it.only('Must find a certificate  by Wallet for the Contract Mercantil asset', async () => {
        const page = await getAppPage();
        const results = await searchByWallet(page, actives.CONTRACT_MERCANTIL);
    
        expect(results).to.not.be.null;
        expect(results.some(result => result.includes('CONTRATO-MERCANTIL'))).to.be.true;
    });

    it.only('Must find a certificate  by Wallet for the Duplicate Mercantil asset', async () => {
        const page = await getAppPage();
        const results = await searchByWallet(page, actives.DUPLICATE_MERCANTIL);
    
        expect(results).to.not.be.null;
        expect(results.some(result => result.includes('DUPLICATA-MERCANTIL'))).to.be.true;
    });

    it.only('Must find a certificate  by Wallet for the Service Duplicate asset', async () => {
        const page = await getAppPage();
        const results = await searchByWallet(page, actives.DUPLICATE_SERVICE);
    
        expect(results).to.not.be.null;
        expect(results.some(result => result.includes('DUPLICATA-DE-SERVICO'))).to.be.true;
    });

    it.only('Must find a certificate  by Wallet for the UR asset', async () => {
        const page = await getAppPage();
        const results = await searchByWallet(page, actives.UR);
    
        expect(results).to.not.be.null;
        expect(results.some(result => result.includes('UR'))).to.be.true;
    });

    it.only('Must find a certificate  by Wallet for the CPR asset', async () => {
        const page = await getAppPage();
        const results = await searchByWallet(page, actives.CPR);
    
        expect(results).to.not.be.null;
        expect(results.some(result => result.includes('CPR'))).to.be.true;
    });
});
