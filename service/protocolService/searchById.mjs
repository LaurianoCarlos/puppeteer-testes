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

  await page.waitForFunction(() => {
    const button = document.querySelector('button#buttonSearch');
    return button && button.offsetParent !== null && !button.disabled;
  });

  await page.evaluate(() => {
    document.querySelector('button#buttonSearch').click();
  });
  
  await Utils.waitForLoading(page);
  const results = await Utils.getTableResults(page);

  return results;
}
