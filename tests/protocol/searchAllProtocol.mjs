import { PROTOCOL_SEARCH_BASE } from '../../config/constant.mjs';
import { waitForLoading, getTableResults } from '../../helpers/helpers.js'

export async function searchAllProtocols(page) {
  await page.goto(PROTOCOL_SEARCH_BASE);
  await page.waitForSelector('button#buttonSearch', { visible: true });

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


export async function searchProtocolsByAllFilters(page, status, startDate, endDate) {
  await page.goto(PROTOCOL_SEARCH_BASE);

  if (status) {
    await page.select('select#statusValue', status);
  }

  if (startDate) {
    await page.waitForSelector('input#startDate', { visible: true });
    await page.type('input#startDate', startDate);
  }
  if (endDate) {
    await page.waitForSelector('input#endDate', { visible: true });
    await page.type('input#endDate', endDate);
  }

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
