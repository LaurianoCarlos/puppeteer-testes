import { expect } from 'chai';
import { TIME } from '../../config/constant.mjs';
import { uuid } from '../../helpers/mock.js';
import { SLUG } from '../../config/constant.mjs';
import { getAppPage, closeBrowser } from "../../service/loginSetup.mjs";
import { searchById } from "../../service/serviceDuplicateService/searchById.mjs";
import { searchByWallet, searchByWalletNotFound } from "../../service/serviceDuplicateService/searchByWallet.mjs";

import ApiInterfaceService  from '../../core/api-de-interface-clientes.js';

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

});
