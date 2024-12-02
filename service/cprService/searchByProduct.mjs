import { ROUTE } from '../../config/constant.mjs';
import { Utils } from '../../helpers/Utils.js';

/**
 * CPR product search based on name.
 * @param {object} page - The current page.
 * @param {string} product - The Profuct to search for.
 * @returns {object} An object containing the search results and any feedback messages.
 */
export async function searchByProduct(page, product) {
  await page.goto(ROUTE.CPR_CREATE_BASE);

  await page.evaluate(() => {
      document.querySelector('#headingProduct').scrollIntoView();
  });

  await page.evaluate(() => {
    document.querySelector('#buttonProduct').click();
  });

  await Utils.expandSectionIfCollapsed(page, '#collapseProduct', 'button[aria-controls="collapseProduct"]');

  await page.waitForSelector('#product_query', { visible: true });
  await page.type('#product_query', product);
  await page.click('.btn-search-query');

  await page.waitForSelector('.modal-content', { visible: true });

 
  const modalContent = await page.evaluate(() => {
      const modal = document.querySelector('.modal-content');
      if (!modal) {
          throw new Error('Modal não encontrado!');
      }
      return modal.innerHTML;
  });

  const itemIndex = 0;

  await page.evaluate((index) => {
      const button = document.querySelectorAll('.list-group-item .btn-light')[index];
      if (button) {
          button.click();
      } else {
          throw new Error(`Item com índice ${index} não encontrado.`);
      }
  }, itemIndex);

  await page.waitForSelector('.modal-content', { hidden: true });

  await page.evaluate(() => {
      document.querySelector('#headingHarvest').scrollIntoView();
  });

  await page.waitForSelector('#buttonHarvest', { visible: true });
  await page.evaluate(() => {
      const button = document.querySelector('#buttonHarvest');
      if (button) {
          button.click();
      } else {
          throw new Error('Botão não encontrado!');
      }
  });

  await page.waitForSelector('.collapse.show', { visible: true });

  return { modalContent };
}


