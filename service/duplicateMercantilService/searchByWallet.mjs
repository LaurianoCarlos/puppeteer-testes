import { ROUTE } from '../../config/constant.mjs';
import { Utils } from '../../helpers/Utils.js';

/**
 * Performs the search for a commercial duplicate based on the Portfolio.
 * @param {object} page - The current page.
 * @param {int} selectOption - The index of the select option to be chosen (starting from 0).
 */
export async function searchByWallet(page, wallet) {
    await page.goto(ROUTE.DUPLICATE_MERCANTIL_SEARCH_BASE);
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
  
  export async function searchByWalletNotFound(page, wallet) {
    await page.goto(ROUTE.DUPLICATE_MERCANTIL_SEARCH_BASE);
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
          console.log(`Added new option for walletId: ${walletValue}`);
        }
  
        selectElement.value = walletValue;
        selectElement.dispatchEvent(new Event('change', { bubbles: true }));
      } else {
        throw new Error('Elemento select#walletId não encontrado.');
      }
    }, wallet);
  
    await page.waitForSelector('button[type="submit"]', { visible: true });
    await page.evaluate(() => document.querySelector('button[type="submit"]').click());
    await Utils.waitForTableResults(page);
    
    const message = await Utils.getToastrMessage(page);
    const results = await Utils.getTableResults(page);
  
    return { results, message };
  }