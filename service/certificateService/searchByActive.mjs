import { ROUTE } from '../../config/constant.mjs';
import { Utils } from '../../helpers/Utils.js';

/**
 * Performs the search for a commercial duplicate based on the Portfolio.
 * @param {object} page - The current page.
 * @param {int} selectOption - The index of the select option to be chosen (starting from 0).
 * @returns {Array} results
 */
export async function searchByActive(page, assetType) {
    await page.goto(ROUTE.CERTIFICATE_SEARCH_BASE);
    await page.select('select#typeSearch', 'asset');
  
    await page.waitForSelector('select#assetType', { visible: true });
    await page.select('select#assetType', assetType);
     
    await page.waitForSelector('button[type="submit"]', { visible: true });
    await page.evaluate(() => document.querySelector('button[type="submit"]').click());
  
    await waitForLoadingToDisappear(page);
    
    await Utils.waitForTableResults(page);
    const results = await Utils.getTableResults(page);
    
    return results;
  }

  async function waitForLoadingToDisappear(page) {
    await page.waitForFunction(() => {
        const loadingElement = document.querySelector('#loading');
        return loadingElement && getComputedStyle(loadingElement).display === 'none';
    });
}