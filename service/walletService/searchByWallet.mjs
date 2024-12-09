import { ROUTE } from '../../config/constant.mjs';

/**
 * Searches for a wallet by its name.
 * @param {object} page - The current page.
 * @param {string} walletName - The name of the wallet to search for.
 * @returns {Array} An array containing the results of the search.
 */
export async function searchByName(page, walletName) {
  await page.goto(ROUTE.WALLET_SEARCH_BASE);

  await page.select('select#wallet', 'walletName');
  await page.type('input#walletText', walletName);
  await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForSelector('.card-datatable', { timeout: 60000 }),
  ]);
  
  const results = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.card-datatable tbody tr')).map(row => row.innerText);
  });

  return results;
}

