import chalk from 'chalk';

export async function searchWalletByName(page, walletName) {
  await page.goto('http://localhost:8023/wallet/search');

  await page.select('select#wallet', 'walletName'); // Selecione "Nome da Carteira"
  await page.type('input#walletText', walletName); 

  await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForSelector('.card-datatable', { timeout: 60000 }), // Aguarda a tabela de resultados
  ]);

  // Verifique os resultados
  const results = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.card-datatable tbody tr')).map(row => {
      return row.innerText;
    });
  });

  // Verifique se o nome da carteira esperado está presente nos resultados
  if (results.some(result => result.includes(walletName))) {
    console.log(chalk.green('Teste de busca por Nome da Carteira passou!')); 
    throw new Error(`Nome da carteira "${walletName}" não encontrado nos resultados.`);
  } else {
    console.log(chalk.red('Teste de busca por Nome da Carteira falhou!'));
    
  }
}

export async function searchWalletByNameNotFound(page, walletName) {
  await page.goto('http://localhost:8023/wallet/search');

  await page.select('select#wallet', 'walletName');
  await page.type('input#walletText', walletName); 

  await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForSelector('.card-datatable', { timeout: 60000 }),
  ]);

  const tableExists = await page.$('.card-datatable') !== null;
  if (!tableExists) {
    console.log(chalk.green('Tabela de resultados não encontrada, teste de buscar por nome da carteira não passou!'));
  }

  const results = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.card-datatable tbody tr')).map(row => {
      return row.innerText;
    });
  });

  
  if (!results.some(result => result.includes(walletName))) {
    console.log(chalk.green('Teste de buscar por nome da carteira inexistente passou!')); 
  } else {
    console.log(chalk.red('Teste buscar por nome da carteira inexistente falhou!'));
  }
}
