import { WALLET_CREATE_BASE } from '../../config/constant.mjs';
import { getProtocol } from '../../helpers/helpers.js';

export async function createWallet(page, walletData) {

  await page.goto(WALLET_CREATE_BASE);

  await page.type('#walletName', walletData.name);
  await page.type('#walletDescription', walletData.description);
  await page.select('#achievementId', walletData.achievementId); 
  await page.waitForSelector('button[type="submit"]', { timeout: 10000 });


  await page.evaluate(() => {
    document.querySelector('button[type="submit"]').click();
  });
  await page.waitForSelector('.toast-success', { timeout: 20000 });

  const successMessage = await page.evaluate(() => {
    const toast = document.querySelector('.toast-success');
    return toast ? toast.innerText : null;
  });

  const protocolData = await getProtocol(page);
  
  return { successMessage, protocolData };
}
