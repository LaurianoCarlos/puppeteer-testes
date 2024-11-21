import { ROUTE } from '../../config/constant.mjs';
import { Utils } from '../../helpers/Utils.js';

/**
 * Searches for a Mercantile Duplicate based on the Wallet.
 * @param {object} page - The current page.
 * @param {string} wallet - The wallet ID to search for.
 * @returns {object} An object containing the search results and any feedback messages.
 */
export async function searchByWallet(page, wallet) {
  await page.goto(ROUTE.CONTRACT_MERCANTIL_SEARCH_BASE);
  await page.select('select#searchType', '2');
  await page.waitForSelector('select#walletId', { visible: true });
  await page.select('select#walletId', wallet);
  await page.waitForSelector('button[type="submit"]', { visible: true });
  await page.evaluate(() => document.querySelector('button[type="submit"]').click());
  await Utils.waitForTableResults(page);

  const message = await Utils.getToastrMessage(page);
  const results = await Utils.getTableResults(page);
  
  return { results, message };
}

/**
 * Searches for a Mercantile Duplicate by Wallet but handles cases where the wallet is not found.
 * @param {object} page - The current page.
 * @param {string} wallet - The wallet ID to search for.
 * @returns {object} An object containing the search results and any feedback messages.
 */
export async function searchByWalletNotFound(page, wallet) {
  await page.goto(ROUTE.CONTRACT_MERCANTIL_SEARCH_BASE);

  await page.select('select#searchType', '2');
  await page.waitForSelector('select#walletId', { visible: true });
  await page.evaluate((walletValue) => {
    const selectElement = document.querySelector('select#walletId');
    if (selectElement) {
      const options = Array.from(selectElement.options).map(option => option.value);

      if (!options.includes(walletValue)) {
        const newOption = document.createElement('option');
        newOption.value = walletValue;
        newOption.textContent = walletValue;
        selectElement.appendChild(newOption);
      }

      selectElement.value = walletValue;
      selectElement.dispatchEvent(new Event('change', { bubbles: true }));
    } else {
      throw new Error('Element select#walletId not found.');
    }
  }, wallet);

  await page.waitForSelector('button[type="submit"]', { visible: true });
  await page.evaluate(() => document.querySelector('button[type="submit"]').click());
  await Utils.waitForTableResults(page);

  const message = await Utils.getToastrMessage(page);
  const results = await Utils.getTableResults(page);

  return { results, message };
}
