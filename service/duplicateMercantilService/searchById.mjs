import { ROUTE } from '../../config/constant.mjs';
import { Utils } from '../../helpers/Utils.js';

/**
 * Performs the search for a commercial duplicate based on the ID.
 * @param {object} page - The current page.
 * @param {string} duplicateId - The ID of the commercial duplicate.
 */
export async function searchById(page, duplicateId) {
    await page.goto(ROUTE.DUPLICATE_MERCANTIL_SEARCH_BASE);
    await page.select('select#searchType', '1');
    await page.type('input#duplicateMercantilId', duplicateId);
    await page.waitForSelector('button[type="submit"]', { visible: true });
    await page.evaluate(() => document.querySelector('button[type="submit"]').click());
  
    await Utils.waitForTableResults(page);
    const results = Utils.getTableResults(page);
  
    return results;
  }