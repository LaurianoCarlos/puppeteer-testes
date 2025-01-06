import { expect } from 'chai';
import { TIME, PER_PAGE, ROUTE } from '../../config/constant.mjs';
import { getAppPage } from "../../service/loginSetup.mjs";
import { DataTableService } from '../../service/DataTableService.mjs';

describe("Audit Test", function () {
    this.timeout(TIME.FOUR_MINUTES);


    Object.entries(PER_PAGE).forEach(([key, value]) => {
        it(`Must change the number of records per page: PerPage: ${value}`, async () => {
            const page = await getAppPage();
            const { quantity, message } = await DataTableService.perPage(
                page,
                value,
                ROUTE.AUDIT_SEARCH_BASE
            );
  
            expect(quantity).to.equal(value);
            expect(message).to.include(`Exibindo ${value} registros por página`);
        });
    });
  
    it('Must navigate to next page', async () => {
        const page = await getAppPage();
  
        const isPreviousEnabled = await DataTableService.goToNextPage(page, ROUTE.AUDIT_SEARCH_BASE);
        expect(isPreviousEnabled).to.be.true;
    });
  
    it('Must load a specific page', async () => {
        const page = await getAppPage();
        const isLoaded = await DataTableService.goToPage(page, 2, ROUTE.AUDIT_SEARCH_BASE);
        expect(isLoaded).to.be.true;
    });

    it('Must check CSV download', async () => {
        const page = await getAppPage();
    
        const isDownload = await DataTableService.verifyLoadingCsv(page, ROUTE.AUDIT_SEARCH_BASE);
        expect(isDownload).to.be.true;
    });
});
