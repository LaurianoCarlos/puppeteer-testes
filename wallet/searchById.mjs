import chalk from 'chalk';

export async function searchWalletById(page, walletId) {
  await page.goto('http://localhost:8023/wallet/search');

  // Preencha o formulário de busca
  await page.select('select#wallet', 'walletId'); // Selecione "ID da Carteira"
  await page.type('input#walletText', walletId); // Digite o ID da carteira que você deseja buscar

  // Envie o formulário
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

  // Verifique se o ID esperado está presente nos resultados
  if (results.some(result => result.includes(walletId))) {
    console.log(chalk.green('Teste de buscar pelo ID passou!')); // Mensagem de sucesso em verde
  } else {
    console.log(chalk.red('Teste de buscar pelo ID falhou!')); // Mensagem de falha em vermelho
  }
}

export async function searchWalletByIdNotFound(page, walletId) {
  // Acesse a página de busca
  await page.goto('http://localhost:8023/wallet/search');

  // Preencha o formulário de busca com um ID que não existe
  await page.select('select#wallet', 'walletId'); // Selecione "ID da Carteira"
  await page.type('input#walletText', walletId); // Digite um ID que você sabe que não existe

  // Envie o formulário
  await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForSelector('.card-datatable', { timeout: 60000 }), // Aguarda a tabela de resultados
  ]);

  // Verifique se a tabela existe
  const tableExists = await page.$('.card-datatable') !== null;
  if (!tableExists) {
    console.log(chalk.green('Tabela de resultados não encontrada, teste de não encontrado passou!'));
    return;
  }

  // Verifique os resultados
  const results = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.card-datatable tbody tr')).map(row => {
      return row.innerText;
    });
  });

  // Verifique se o ID esperado não está presente nos resultados
  if (!results.some(result => result.includes(walletId))) {
    console.log(chalk.green('Teste de buscar pelo ID inexistente passou!')); // Mensagem de sucesso em verde
  } else {
    console.log(chalk.red('Teste de buscar pelo ID inexistente falhou!')); // Mensagem de falha em vermelho
  }
}
