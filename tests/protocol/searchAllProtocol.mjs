import { PROTOCOL_SEARCH_BASE } from '../../config/constant.mjs';
import { waitForLoading, getTableResults } from '../../helpers/helpers.js'

export async function searchAllProtocols(page) {
  await page.goto(PROTOCOL_SEARCH_BASE);
  await page.waitForSelector('button#buttonSearch', { visible: true });

  await page.evaluate(() => {
    document.querySelector('button#buttonSearch').scrollIntoView();
  });

  console.log("Verificando visibilidade e habilitação do botão de busca antes de clicar");
  await page.waitForFunction(() => {
    const button = document.querySelector('button#buttonSearch');
    return button && button.offsetParent !== null && !button.disabled;
  });

  console.log("Tentando clicar no botão de busca");
  await page.evaluate(() => {
    document.querySelector('button#buttonSearch').click();
  });

  await waitForLoading(page);
  const results = getTableResults(page);

  return results;
}
