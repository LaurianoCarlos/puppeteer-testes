import { PROTOCOL_SEARCH_BASE } from '../../config/constant.mjs';
import { waitForLoading, getTableResults } from '../../helpers/helpers.js';

export async function searchProtocolsByDateRange(page, startDate, endDate) {
  await page.goto(PROTOCOL_SEARCH_BASE);
  await page.waitForSelector('input#startDate', { visible: true });
  await page.type('input#startDate', startDate);
  await page.waitForSelector('input#endDate', { visible: true });
  await page.type('input#endDate', endDate);

  await page.evaluate(() => document.querySelector('button#buttonSearch').scrollIntoView());
  await page.waitForFunction(() => {
    const button = document.querySelector('button#buttonSearch');
    return button && button.offsetParent !== null && !button.disabled;
  });
  await page.evaluate(() => document.querySelector('button#buttonSearch').click());
  await waitForLoading(page);
  const results = await getTableResults(page);

  return results;
}
