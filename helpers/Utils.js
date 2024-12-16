export class Utils {

  /**
   * Fills in fields on a page based on provided field data.
   * @param {object} page - The Puppeteer page object.
   * @param {Array} fields - An array of field objects containing selector, type, and value.
   */
  static async fillInFields(page, fields) {
    for (const field of fields) {
      await page.waitForSelector(field.selector, { visible: true });

      if (field.type === 'select') {
        await page.select(field.selector, field.value);
      } else {
        await page.type(field.selector, field.value);
      }
    }
  }

  /**
   * Retrieves protocol data from the first visible row in the DataTable.
   * @param {object} page - The Puppeteer page object.
   * @returns {object} An object containing protocol data { protocolId, status, createdAt }.
   * @throws {Error} If no protocol data is available.
   */
  static async getProtocol(page) {
    const dataAvailable = await page.evaluate(() => {
      return document.querySelector('.card-datatable tbody tr:not(.c-hidden)') !== null;
    });

    if (!dataAvailable) {
      throw new Error('Nenhum dado de protocolo disponível.');
    }

    const protocolData = await page.evaluate(() => {
      const protocolRow = document.querySelector('.card-datatable tbody tr:not(.c-hidden)');
      const cells = protocolRow.querySelectorAll('td');
      return {
        protocolId: cells[0] ? cells[0].innerText.trim() : null,
        status: cells[1] ? cells[1].innerText.trim() : null,
        createdAt: cells[2] ? cells[2].innerText.trim() : null,
      };
    });

    return protocolData;
  }

  /**
   * Expands a section of the form if it is collapsed.
   * @param {object} page - The Puppeteer page object.
   * @param {string} selector - Selector for the section to expand.
   * @param {string} controlButtonSelector - Selector for the control button to expand the section.
   * @param {boolean|null} active - Optional condition for checking if the section is active.
   */
  static async expandSectionIfCollapsed(page, selector, controlButtonSelector, active = null) {
    const isCollapsed = await page.$eval(selector, el => el.classList.contains('collapse'));
    if (isCollapsed) {
      await page.click(controlButtonSelector);
    }

    if (active) {
      await page.waitForSelector(`${selector} active`, { visible: true });
    } else {
      await page.waitForSelector(`${selector}.show`, { visible: true });
    }

  }

  /**
   * Waits for the DataTable to load by observing the `c-hidden` class applied during loading.
   * @param {object} page - The Puppeteer page object.
   */
  static async waitForLoading(page) {
    await page.waitForFunction(() => {
      const loadingRow = document.querySelector('tr[wire\\:loading\\.class\\.remove="c-hidden"]');
      return loadingRow && !loadingRow.classList.contains('c-hidden');
    });

    await page.waitForFunction(() => {
      const loadingRow = document.querySelector('tr[wire\\:loading\\.class\\.remove="c-hidden"]');
      return loadingRow && loadingRow.classList.contains('c-hidden');
    });
  }

  /**
   * Retrieves results from the DataTable, excluding loading or updating rows.
   * @param {object} page - The Puppeteer page object.
   * @returns {Array} An array containing visible DataTable row results.
   */
  static async getTableResults(page) {
    return await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.card-datatable tbody tr'))
        .map(row => row.innerText.trim())
        .filter(text => text.length > 0 && !text.includes('Carregando') && !text.includes('Atualizando'));
    });
  }

  /**
  * Waits until the DataTable displays result rows or a message.
  * @param {object} page - The Puppeteer page object.
  * @returns {Promise<void>} A promise resolved when the condition is met.
  */
  static async waitForTableResults(page) {
    await page.waitForFunction(() => {
      const tableRows = document.querySelectorAll('.card-datatable tbody tr');
      const noResultsMessage = document.querySelector('.card-datatable .no-results');
      return tableRows.length > 0 || noResultsMessage !== null;
    });
  }

  /**
     * Captures the toastr message displayed on the page.
     * @param {object} page - The Puppeteer page object.
     * @param {number} timeout - The maximum wait time (in milliseconds) for the toastr to appear.
     * @returns {Promise<string>} - The captured toastr message.
     */
  static async getToastrMessage(page) {
    const toastrElement = await page.waitForSelector('.toast-message', { visible: true });
    return await page.evaluate(element => element.innerText, toastrElement);
  }

  /**
     * Forces a click on an element based on its selector.
     * @param {object} page - The Puppeteer page object.
     * @param {string} selector - The selector for the element to click.
     */
  static async forcedClick(page, select) {
    return await page.evaluate((selector) => {
      const button = document.querySelector(selector);
      if (button) {
        button.click();
      } else {
        throw new Error('Elemento não encontrado!');
      }
    }, select);
  }

  static async liquidationAddPayment(page, route, formData) {

    const fields = [
        { selector: '#payment_value', value: formData.assetValue },
        { selector: '#payment_date', value: formData.issuanceDate },
        { selector: '#liquidation_type', value: formData.holderDocumentType, type: 'select' },
    ];

    await page.goto(route);

    await Utils.fillInFields(page, fields);
    
    await page.waitForSelector('button[type="submit"]', { visible: true });
    await page.evaluate(() => document.querySelector('button[type="submit"]').click());


    await page.waitForSelector('.toast-success', { visible: true });

    const successMessage = await Utils.getToastrMessage(page);
    const protocolData = await Utils.getProtocol(page);

    return { successMessage, protocolData };
  }

}

