import { expect } from 'chai';
import { TIME, PROTOCOL_STATUS, SERVICES, PER_PAGE, ROUTE } from '../../config/constant.mjs';
import { getAppPage } from "../../service/loginSetup.mjs";
import { create } from "../../service/urService/create.mjs";
import protocolLogger from '../../service/ProtocolCSVLogger.js';

import { mockUr } from '../../helpers/mock.js';
import { DataTableService } from '../../service/DataTableService.mjs';


describe("UR Test", function () {
    this.timeout(TIME.FOUR_MINUTES);

    Object.entries(PER_PAGE).forEach(([key, value]) => {
        it(`Must change the number of records per page: PerPage: ${value}`, async () => {
            const page = await getAppPage();
            const { quantity, message } = await DataTableService.perPage(
                page,
                value,
                ROUTE.UR_SEARCH_BASE
            );
  
            expect(quantity).to.equal(value);
            expect(message).to.include(`Exibindo ${value} registros por página`);
        });
    });
  
    it.skip('Must navigate to next page', async () => {
        const page = await getAppPage();
  
        const isPreviousEnabled = await DataTableService.goToNextPage(page, ROUTE.UR_SEARCH_BASE);
        expect(isPreviousEnabled).to.be.true;
    });
  
    it.skip('Must load a specific page', async () => {
        const page = await getAppPage();
        const isLoaded = await DataTableService.goToPage(page, 2, ROUTE.UR_SEARCH_BASE);
        expect(isLoaded).to.be.true;
    });

    it('Must check CSV download', async () => {
        const page = await getAppPage();
    
        const isDownload = await DataTableService.verifyLoadingCsv(page, ROUTE.UR_SEARCH_BASE);
        expect(isDownload).to.be.true;
    });

    it('You must fill in the fields and send it for registration', async () => {
        const page = await getAppPage();
        
        const formData = mockUr();
        formData.accreditor_document_number =  "01027058000191";
        formData.document_number =  "33473635000164";

        const { successMessage, protocolData } = await create(page, formData);

        expect(successMessage).to.include('UR enviada para registro com sucesso!');
        expect(protocolData).to.not.be.null;

        protocolLogger.addProtocol(protocolData, PROTOCOL_STATUS.FINISHED, SERVICES.UR);
    });
});
