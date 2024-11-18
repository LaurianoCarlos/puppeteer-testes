import { ROUTE } from '../../config/constant.mjs';
import { Utils } from '../../helpers/Utils.js';

/**
 * Realiza a busca por uma duplicata mercantil com base na Carteira.
 * @param {object} page - A página atual.
 * @param {int} selectOption - O índice da opção do select a ser escolhida (começando em 0).
 */
export async function searchDuplicateByWallet(page, wallet) {
  await page.goto(ROUTE.DUPLICATE_SERVICE_SEARCH_BASE);
  await page.select('select#searchType', '2');

  await page.waitForSelector('select#walletId', { visible: true });
  await page.select('select#walletId', wallet);
   
  await page.waitForSelector('button[type="submit"]', { visible: true });
  await page.evaluate(() => document.querySelector('button[type="submit"]').click());

  await Utils.waitForTableResults(page);
  const message = await Utils.getToastrMessage(page);
  const results = Utils.getTableResults(page);

  
  return { results, message };
}



