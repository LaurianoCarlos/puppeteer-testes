import { PROTOCOL_SEARCH_BASE } from '../../config/constant.mjs';
import { waitForLoading, getTableResults } from '../../helpers/helpers.js'

export async function searchProtocolByStatus(page, status) {
  await page.goto(PROTOCOL_SEARCH_BASE);
  await page.waitForSelector('select#statusValue', { visible: true });
  
  await page.select('select#statusValue', status);

  await page.evaluate(() => {
    document.querySelector('button#buttonSearch').scrollIntoView();
  });

  await page.waitForFunction(() => {
    const button = document.querySelector('button#buttonSearch');
    return button && button.offsetParent !== null && !button.disabled;
  });

  await page.evaluate(() => {
    document.querySelector('button#buttonSearch').click();
  });

  await waitForLoading(page);
  const results = getTableResults(page);

  return results;
}
