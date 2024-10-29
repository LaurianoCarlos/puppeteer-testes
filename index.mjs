import puppeteer from 'puppeteer';
import { login } from './login.mjs';
import { searchWalletById, searchWalletByIdNotFound } from './wallet/searchById.mjs';
import { searchWalletByName, searchWalletByNameNotFound } from './wallet/searchByWallet.mjs';

(async () => {
  const browser = await puppeteer.launch({ headless: false }); //false para exibir o navegador
  const page = await browser.newPage();
  await page.setViewport();

  try {
    await login(page);
    console.log("Iniciando teste de Carteiras.")
    await searchWalletById(page, '9d5c7c1d-70fa-4a1e-bbfe-fb1f6e68361e'); 
    await searchWalletByIdNotFound(page, '9d5c7c1d-70fa-4a1e-bbfe-123456789'); 
    
    await searchWalletByName(page, 'Nome da Carteira') //carteira de teste de contrato
    await searchWalletByNameNotFound(page, 'Nome da Carteira')
  } catch (error) {
    console.error('Erro durante o teste:', error);
  } finally {
    console.log(' ')
    console.log("TODOS OS TESTES FORAM EXECUTADOS!")
    await browser.close();
  }
})();
