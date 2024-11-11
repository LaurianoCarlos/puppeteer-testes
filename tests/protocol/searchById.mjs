import { PROTOCOL_SEARCH_BASE } from '../../config/constant.mjs';
import { getTableResults } from '../../helpers/helpers.js';

export async function searchProtocolById(page, protocolId) {
  await page.goto(PROTOCOL_SEARCH_BASE);
  await page.type('input#protocolId', protocolId);

  await Promise.all([
    page.click('button#buttonSearch'),
    page.waitForSelector('.card-datatable', { timeout: 60000 }),
  ]);

  const results = getTableResults(page);

  return results;
}
