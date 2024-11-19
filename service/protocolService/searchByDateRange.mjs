import { ROUTE } from '../../config/constant.mjs';
import { Utils } from '../../helpers/Utils.js';

/**
 * Searches for protocols within a specified date range.
 * @param {object} page - The current page.
 * @param {string} startDate - The start date for the search range in "YYYY-MM-DD" format.
 * @param {string} endDate - The end date for the search range in "YYYY-MM-DD" format.
 * @returns {Array} An array containing the search results.
 */
export async function searchByDateRange(page, startDate, endDate) {
  await page.goto(ROUTE.PROTOCOL_SEARCH_BASE);
  await page.waitForSelector('input#startDate', { visible: true });
  await page.type('input#startDate', startDate);
  await page.waitForSelector('input#endDate', { visible: true });
  await page.type('input#endDate', endDate);
  await page.evaluate(() => document.querySelector('button#buttonSearch').scrollIntoView());

  await page.waitForFunction(() => {
    const button = document.querySelector('button#buttonSearch');
    return button && button.offsetParent !== null && !button.disabled;
  });

  await page.evaluate(() => document.querySelector('button#buttonSearch').click());
  await Utils.waitForLoading(page);

  const results = await Utils.getTableResults(page);

  return results;
}
