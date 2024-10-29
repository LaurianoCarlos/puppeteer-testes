export async function searchWalletByName(page, walletName) {
  await page.goto('http://localhost:8023/wallet/search');

  // Preenche o formulário de busca
  await page.select('select#wallet', 'walletName');
  await page.type('input#walletText', walletName);

  // Envia o formulário e aguarda o carregamento dos resultados
  await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForSelector('.card-datatable', { timeout: 60000 }),
  ]);

  // Extrai os resultados da tabela
  const results = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.card-datatable tbody tr')).map(row => row.innerText);
  });

  return results;
}

export async function searchWalletByNameNotFound(page, walletName) {
  await page.goto('http://localhost:8023/wallet/search');

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
