import { ROUTE } from '../../config/constant.mjs';
import { Utils } from '../../helpers/Utils.js';

/**
 * Searches for all available protocols without applying any filters.
 * @param {object} page - The current page.
 * @returns {Array} An array containing the search results.
 */
export async function searchAll(page) {
  await page.goto(ROUTE.PROTOCOL_SEARCH_BASE);
  await page.waitForSelector('button#buttonSearch', { visible: true });

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

/**
 * Searches for protocols based on provided filters.
 * @param {object} page - The current page instance.
 * @param {string} [status] - The status to filter protocols by (optional).
 * @param {string} [startDate] - The start date for the search range in "YYYY-MM-DD" format (optional).
 * @param {string} [endDate] - The end date for the search range in "YYYY-MM-DD" format (optional).
 * @returns {Array} An array containing the search results.
 */
export async function searchAllByFilters(page, status, startDate, endDate) {
  await page.goto(ROUTE.PROTOCOL_SEARCH_BASE);

  if (status) {
    await page.select('select#statusValue', status);
  }

  if (startDate) {
    await page.waitForSelector('input#startDate', { visible: true });
    await page.type('input#startDate', startDate);
  }

  if (endDate) {
    await page.waitForSelector('input#endDate', { visible: true });
    await page.type('input#endDate', endDate);
  }

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
