import { expect } from 'chai';
import { TIME, SLUG } from '../../config/constant.mjs';
import { setup, closeBrowser } from "../../service/loginSetup.mjs";
import { findDuplicates } from "../../core/api-de-interface-clientes.js";
import { searchDuplicateById } from "./searchById.mjs";

let page;
let duplicate;

const DUPLICATE = {
    duplicateIdNotFound: 'xx1555xx-70fa-4a1e-bbfe-123456789',
}

describe("Teste de Duplicata de Serviço", function () {
    this.timeout(TIME.ONE_MINUTE);

    before(async () => {
        page = await setup();
        duplicate = (await findDuplicates(SLUG.DUPLICATE_SERVICE_SLUG))[0];
    });

    after(async () => {
        await closeBrowser();
    });
/*
    it('Deve encontrar uma Duplicata de Serviço pelo ID', async () => {
        const results = await searchDuplicateById(page, duplicate.asset_uuid);
        expect(results.some(result => result.includes(duplicate.asset_uuid))).to.be.true;
    });

    it('Não deve encontrar uma Duplicata de Serviço pelo ID', async () => {
        const results = await searchDuplicateById(page, DUPLICATE.duplicateIdNotFound);
        expect(results.some(result => result.includes(DUPLICATE.duplicateId))).to.be.false;
    });*/

    it('Deve encontrar uma Duplicata de Serviço pela Carteira', async () => {
        const results = await searchDuplicateById(page, duplicate.wallet);
        expect(results.some(result => result.includes(duplicate.asset_uuid))).to.be.true;
    });

    it('Não deve encontrar uma Duplicata de Serviço pela Carteira', async () => {
        const results = await searchDuplicateById(page, DUPLICATE.duplicateIdNotFound);
        expect(results.some(result => result.includes(DUPLICATE.duplicateId))).to.be.false;
    });

})



