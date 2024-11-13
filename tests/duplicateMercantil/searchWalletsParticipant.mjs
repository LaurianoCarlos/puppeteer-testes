import { DUPLICATE_MERCANTIL_CREATE_BASE } from '../../config/constant.mjs';
import { TIME } from '../../config/constant.mjs';

/**
 * Função para buscar carteiras com base no CNPJ do participante e capturar as mensagens.
 * @param {object} page - A página Puppeteer.
 * @param {string} cnpj - O CNPJ do participante para a busca.
 */
export async function searchWalletsParticipant(page, cnpj) {
  await page.goto(DUPLICATE_MERCANTIL_CREATE_BASE);
  await page.waitForSelector('#main_participant_cnpj', { visible: true });
  await page.type('#main_participant_cnpj', cnpj);
  await page.waitForSelector('#searchWalletsParticipant', { visible: true, timeout: TIME.THIRTY_SECONDS });
  await page.evaluate(() => document.querySelector('#searchWalletsParticipant').click());

  const toastrMessage = await page.waitForSelector('.toast-message', { visible: true, timeout: TIME.THIRTY_SECONDS });
  const message = await page.evaluate(element => element.innerText, toastrMessage);

  return { message };
}

/**
 * Função para buscar carteiras com base no CNPJ do participante.
 * @param {object} page - A página Puppeteer.
 * @param {string} cnpj - O CNPJ do participante para a busca.
 */
export async function findWalletsParticipant(page, cnpj) {
  await page.goto(DUPLICATE_MERCANTIL_CREATE_BASE);
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
