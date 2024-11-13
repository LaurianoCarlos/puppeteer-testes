import { ROUTE } from '../../config/constant.mjs';
import { Utils } from '../../helpers/Utils.js';

/**
 * Realiza a busca por uma duplicata mercantil com base no ID.
 * @param {object} page - A página atual.
 * @param {string} duplicateId - O ID da duplicata mercantil.
 */
export async function searchDuplicateById(page, duplicateId) {
  await page.goto(ROUTE.DUPLICATE_MERCANTIL_SEARCH_BASE);
  await page.select('select#searchType', '1');
  await page.type('input#duplicateMercantilId', duplicateId);
  await page.waitForSelector('button[type="submit"]', { visible: true });
  await page.evaluate(() => document.querySelector('button[type="submit"]').click());

  await Utils.waitForTableResults(page);
  const results = Utils.getTableResults(page);

  return results;
}
