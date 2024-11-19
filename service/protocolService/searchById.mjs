import { ROUTE } from '../../config/constant.mjs';
import { Utils } from '../../helpers/Utils.js';

/**
 * Searches for a protocol by its ID.
 * @param {object} page - The current page.
 * @param {string} protocolId - The ID of the protocol to search for.
 * @returns {Array} An array containing the search results.
 */
export async function searchById(page, protocolId) {
  await page.goto(ROUTE.PROTOCOL_SEARCH_BASE);
  await page.type('input#protocolId', protocolId);

  await Promise.all([
    page.click('button#buttonSearch'),
    page.waitForSelector('.card-datatable', { timeout: 60000 }),
  ]);

  const results = await Utils.getTableResults(page);

  return results;
}
