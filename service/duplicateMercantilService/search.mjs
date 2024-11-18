import { ROUTE, TIME } from '../../config/constant.mjs';
import { Utils } from '../../helpers/Utils.js';

/**
 * Performs the search for a commercial duplicate based on the ID.
 * @param {object} page - The current page.
 * @param {string} duplicateId - The ID of the commercial duplicate.
 */
export async function searchById(page, duplicateId) {
  await page.goto(ROUTE.DUPLICATE_MERCANTIL_SEARCH_BASE);
  await page.select('select#searchType', '1');
  await page.type('input#duplicateMercantilId', duplicateId);
  await page.waitForSelector('button[type="submit"]', { visible: true });
  await page.evaluate(() => document.querySelector('button[type="submit"]').click());

  await Utils.waitForTableResults(page);
  const results = Utils.getTableResults(page);

  return results;
}

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


/**
 * Search wallets based on the participant's CNPJ and capture messages.
 * @param {object} page - The current page.
 * @param {string} cnpj - The participant's CNPJ for the search.
 */
export async function searchWalletsParticipant(page, cnpj) {
  await page.goto(ROUTE.DUPLICATE_MERCANTIL_CREATE_BASE);
  await page.waitForSelector('#main_participant_cnpj', { visible: true });
  await page.type('#main_participant_cnpj', cnpj);
  await page.waitForSelector('#searchWalletsParticipant', { visible: true, timeout: TIME.THIRTY_SECONDS });
  await page.evaluate(() => document.querySelector('#searchWalletsParticipant').click());

  const toastrMessage = await page.waitForSelector('.toast-message', { visible: true, timeout: TIME.THIRTY_SECONDS });
  const message = await page.evaluate(element => element.innerText, toastrMessage);

  return { message };
}

/**
 * Search for wallets based on the participant's CNPJ.
 * @param {object} page - The current page.
 * @param {string} cnpj - The participant's CNPJ for the search.
 */
export async function findWalletsParticipant(page, cnpj) {
  await page.goto(ROUTE.DUPLICATE_MERCANTIL_CREATE_BASE);
  await page.waitForSelector('#main_participant_cnpj', { visible: true });
  await page.evaluate((cnpjValue) => {
    const cnpjField = document.querySelector('#main_participant_cnpj');
    cnpjField.value = cnpjValue;
    cnpjField.dispatchEvent(new Event('input', { bubbles: true }));
  }, cnpj);

  await page.waitForSelector('#searchWalletsParticipant', { visible: true });
  await page.evaluate(() => document.querySelector('#searchWalletsParticipant').click());

  await page.waitForFunction(() => {
    const options = document.querySelectorAll('#wallet option:not([value=""])');
    return options && options.length > 0;
  }, { timeout: TIME.THIRTY_SECONDS });
  
  const wallets = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('#wallet option:not([value=""])'))
      .map(option => option.value.trim());
  });

  return wallets;
}