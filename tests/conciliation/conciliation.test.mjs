import { expect } from 'chai';
import { TIME, PROTOCOL_STATUS, SERVICES, PER_PAGE, ROUTE } from '../../config/constant.mjs';
import { getAppPage } from "../../service/loginSetup.mjs";
import { create } from "../../service/conciliationService/create.mjs";
import protocolLogger from '../../service/ProtocolCSVLogger.js';
import { mockConciliation } from '../../helpers/mock.js';

import ApiInterfaceService from '../../core/api-de-interface-clientes.js';
import { DataTableService } from '../../service/DataTableService.mjs';

describe("Conciliation Test", function () {
    this.timeout(TIME.FOUR_MINUTES);


    Object.entries(PER_PAGE).forEach(([key, value]) => {
        it(`Must change the number of records per page: PerPage: ${value}`, async () => {
            const page = await getAppPage();
            const { quantity, message } = await DataTableService.perPage(
                page,
                value,
                ROUTE.CONCILIATION_SEARCH_BASE
            );
  
            expect(quantity).to.equal(value);
            expect(message).to.include(`Exibindo ${value} registros por página`);
        });
    });
  
    it.skip('Must navigate to next page', async () => {
        const page = await getAppPage();
  
        const isPreviousEnabled = await DataTableService.goToNextPage(page, ROUTE.CONCILIATION_SEARCH_BASE);
        expect(isPreviousEnabled).to.be.true;
    });
  
    it.skip('Must load a specific page', async () => {
        const page = await getAppPage();
        const isLoaded = await DataTableService.goToPage(page, 2, ROUTE.CONCILIATION_SEARCH_BASE);
        expect(isLoaded).to.be.true;
    });

    it('You must fill in the fields and send it for registration', async () => {
        const page = await getAppPage();
        const conciliation = (await ApiInterfaceService.getConciliation())[0];

        const formData = mockConciliation();
        formData.wallet = conciliation.values[0].wallet;

        const { successMessage, protocolData } = await create(page, formData);

        expect(successMessage).to.include('Conciliação enviada para registro com sucesso!');
        expect(protocolData).to.not.be.null;

        protocolLogger.addProtocol(protocolData, PROTOCOL_STATUS.FINISHED, SERVICES.CONCILIATION);
    });
});
