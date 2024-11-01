import { WALLET_SEARCH_BASE } from '../../config/constant.mjs';

export async function searchWalletById(page, walletId) {
  await page.goto(WALLET_SEARCH_BASE);

  await page.select('select#wallet', 'walletId');
  await page.type('input#walletText', walletId);

  await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForSelector('.card-datatable', { timeout: 60000 }),
  ]);

  const results = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.card-datatable tbody tr')).map(row => row.innerText);
  });

  return results;
}

export async function searchWalletByIdNotFound(page, walletId) {
  await page.goto(WALLET_SEARCH_BASE);

  await page.select('select#wallet', 'walletId');
  await page.type('input#walletText', walletId);

  await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForSelector('.card-datatable', { timeout: 60000 }),
  ]);

  const results = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.card-datatable tbody tr')).map(row => row.innerText);
  });

  return results; 
}
