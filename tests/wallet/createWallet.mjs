// createWallet.mjs
import { BASE_URL } from '../config.mjs';

export async function createWallet(page, walletData) {
  await page.goto(`${BASE_URL}/wallet/create`); // Usando a URL base

  // Preencha o campo "Nome da Carteira"
  await page.type('#walletName', walletData.name);
  
  // Preencha o campo "Descrição"
  await page.type('#walletDescription', walletData.description);
  
  // Selecione o "Tipo de Ativo"
  await page.select('#achievementId', walletData.achievementId);

  // Submete o formulário
  await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForSelector('.toast-success', { timeout: 60000 }),
  ]);

  const successMessage = await page.evaluate(() => {
    const toast = document.querySelector('.toast-success');
    return toast ? toast.innerText : null;
  });

  return successMessage;
}
