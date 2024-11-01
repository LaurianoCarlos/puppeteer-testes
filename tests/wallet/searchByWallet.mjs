import { WALLET_SEARCH_BASE } from '../../config/constant.mjs';

export async function searchWalletByName(page, walletName) {
  await page.goto(WALLET_SEARCH_BASE);

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

export async function searchWalletByNameNotFound(page, walletName) {
  await page.goto(WALLET_SEARCH_BASE);

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
