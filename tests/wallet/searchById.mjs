export async function searchWalletById(page, walletId) {
  await page.goto('http://localhost:8023/wallet/search');

  // Preenche o formulário de busca
  await page.select('select#wallet', 'walletId');
  await page.type('input#walletText', walletId);

  // Envia o formulário e aguarda o carregamento dos resultados
  await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForSelector('.card-datatable', { timeout: 60000 }),
  ]);

  // Extrai os resultados da tabela
  const results = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.card-datatable tbody tr')).map(row => row.innerText);
  });

  return results; // Retorna os resultados para uso nas asserções
}

export async function searchWalletByIdNotFound(page, walletId) {
  await page.goto('http://localhost:8023/wallet/search');

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
