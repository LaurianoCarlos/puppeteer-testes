import { ROUTE } from '../../config/constant.mjs';
import { Utils } from '../../helpers/Utils.js';

/**
 * Searches for protocols based on their status.
 * @param {object} page - The current page.
 * @param {string} status - The status to filter protocols by.
 * @returns {Array} An array containing the search results.
 */
export async function searchByStatus(page, status) {
  await page.goto(ROUTE.PROTOCOL_SEARCH_BASE);
  await page.waitForSelector('select#statusValue', { visible: true });
  
  await page.select('select#statusValue', status);

  await page.evaluate(() => {
    document.querySelector('button#buttonSearch').scrollIntoView();
  });

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
