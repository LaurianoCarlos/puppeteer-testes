import { ROUTE } from '../../config/constant.mjs';
import { Utils } from '../../helpers/Utils.js';

/**
 * Searches for a Service Duplicate based on its ID.
 * @param {object} page - The current page.
 * @param {string} duplicateId - The ID of the service duplicate.
 * @returns {Array} An array of results found during the search.
 */
export async function searchById(page, duplicateId) {
  await page.goto(ROUTE.CPR_SEARCH_BASE);
  await page.select('select#searchType', '1');
  await page.type('input#cprId', duplicateId);
  await page.waitForSelector('button[type="submit"]', { visible: true });
  await page.evaluate(() => document.querySelector('button[type="submit"]').click());

  await Utils.waitForTableResults(page);
  const results = await Utils.getTableResults(page);

  return results;
}
