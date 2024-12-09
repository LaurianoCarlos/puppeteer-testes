import { ROUTE } from '../../config/constant.mjs';

/**
 * Searches for a wallet by its ID.
 * @param {object} page - The current page.
 * @param {string} walletId - The ID of the wallet to search for.
 * @returns {Array} An array containing the results of the search.
 */
export async function searchById(page, walletId) {
  await page.goto(ROUTE.WALLET_SEARCH_BASE);

  await page.select('select#wallet', 'walletId');
  await page.type('input#walletText', walletId);

  await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForSelector('.card-datatable'),
  ]);

  const results = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.card-datatable tbody tr')).map(row => row.innerText);
  });

  return results;
}