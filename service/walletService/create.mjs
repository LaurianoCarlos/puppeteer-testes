import { WALLET_CREATE_BASE } from '../../config/constant.mjs';
import { Utils } from '../../helpers/Utils.js';

/**
 * Creates a new wallet with the provided data.
 * @param {object} page - The current page.
 * @param {object} walletData - An object containing the wallet details.
 * @returns {object} An object containing the success message and protocol data.
 */
export async function create(page, walletData) {
  await page.goto(WALLET_CREATE_BASE);

  await page.type('#walletName', walletData.name);
  await page.type('#walletDescription', walletData.description);
  await page.select('#achievementId', walletData.achievementId); 
  await page.waitForSelector('button[type="submit"]');


  await page.evaluate(() => {
    document.querySelector('button[type="submit"]').click();
  });
  await page.waitForSelector('.toast-success');

  const successMessage = await page.evaluate(() => {
    const toast = document.querySelector('.toast-success');
    return toast ? toast.innerText : null;
  });

  const protocolData = await Utils.getProtocol(page);
  
  return { successMessage, protocolData };
}
