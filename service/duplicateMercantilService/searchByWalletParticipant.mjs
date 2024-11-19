import { ROUTE } from '../../config/constant.mjs';

/**
 * Search wallets based on the participant's CNPJ and capture messages.
 * @param {object} page - The current page.
 * @param {string} cnpj - The participant's CNPJ for the search.
 */
export async function searchWalletsParticipant(page, cnpj) {
    await page.goto(ROUTE.DUPLICATE_MERCANTIL_CREATE_BASE);
    await page.waitForSelector('#main_participant_cnpj', { visible: true });
    await page.type('#main_participant_cnpj', cnpj);
    await page.waitForSelector('#searchWalletsParticipant', { visible: true});
    await page.evaluate(() => document.querySelector('#searchWalletsParticipant').click());
  
    const toastrMessage = await page.waitForSelector('.toast-message', { visible: true});
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
    });
    
    const wallets = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('#wallet option:not([value=""])'))
        .map(option => option.value.trim());
    });
  
    return wallets;
  }