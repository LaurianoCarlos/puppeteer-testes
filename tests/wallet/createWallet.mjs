import { BASE_URL } from '../config.mjs';

export async function createWallet(page, walletData) {
  await page.goto(`${BASE_URL}/wallet/create`);

  // Preencha os campos do formulário
  await page.type('#walletName', walletData.name);
  await page.type('#walletDescription', walletData.description);

  
  console.log(`Selecionando achievementId: ${walletData.achievementId}`);
  await page.select('#achievementId', walletData.achievementId); // Certifique-se de que o valor existe na lista de opções

  // Clica no botão de submissão do Livewire e espera pela notificação de sucesso
  await page.waitForSelector('button[type="submit"]', { timeout: 10000 });

  // Use evaluate para forçar a submissão do formulário caso o clique não funcione
  await page.evaluate(() => {
    document.querySelector('button[type="submit"]').click();
  });

  // Aguarda a exibição da notificação de sucesso `.toast-success`
  await page.waitForSelector('.toast-success', { timeout: 20000 });

  // Captura a mensagem de sucesso
  const successMessage = await page.evaluate(() => {
    const toast = document.querySelector('.toast-success');
    return toast ? toast.innerText : null;
  });

  // Captura o protocolo exibido após o cadastro
  const protocolData = await page.evaluate(() => {
    const protocolRow = document.querySelector('.card-datatable tbody tr');
    return protocolRow ? protocolRow.innerText : null;
  });

  return { successMessage, protocolData };
}
