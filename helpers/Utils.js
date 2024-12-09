export class Utils {

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
   * Obtém os dados do protocolo a partir da primeira linha visível no DataTable.
   * @param {object} page - A página Puppeteer.
   * @returns {object} Objeto contendo os dados do protocolo { protocolId, status, createdAt }.
   * @throws {Error} Se nenhum dado de protocolo estiver disponível.
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
   * Expande uma seção do formulário caso esteja colapsada.
   * @param {object} page - A página Puppeteer.
   * @param {string} selector - Seletor da seção a ser expandida.
   * @param {string} controlButtonSelector - Seletor do botão de controle para expandir a seção.
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
   * Aguarda o carregamento do DataTable ao observar a classe `c-hidden` aplicada durante o carregamento.
   * @param {object} page - A página Puppeteer.
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
   * Obtém os resultados do DataTable, excluindo linhas de carregamento ou atualização.
   * @param {object} page - A página Puppeteer.
   * @returns {array} Array contendo as linhas de resultados visíveis no DataTable.
   */
  static async getTableResults(page) {
    return await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.card-datatable tbody tr'))
        .map(row => row.innerText.trim())
        .filter(text => text.length > 0 && !text.includes('Carregando') && !text.includes('Atualizando'));
    });
  }

  /**
   * Aguarda até que o DataTable exiba linhas de resultados ou uma mensagem.
   * @param {object} page - A página Puppeteer.
   * @returns {Promise<void>} Promise que se resolve quando a condição é atendida.
   */
  static async waitForTableResults(page) {
    await page.waitForFunction(() => {
      const tableRows = document.querySelectorAll('.card-datatable tbody tr');
      const noResultsMessage = document.querySelector('.card-datatable .no-results');
      return tableRows.length > 0 || noResultsMessage !== null;
    });
  }

  /**
 * Captura a mensagem do toastr exibida na página.
 * @param {object} page - A página atual.
 * @param {number} timeout - O tempo máximo de espera (em milissegundos) para o toastr aparecer.
 * @returns {Promise<string>} - A mensagem do toastr capturada.
 */
  static async getToastrMessage(page) {
    const toastrElement = await page.waitForSelector('.toast-message', { visible: true });
    return await page.evaluate(element => element.innerText, toastrElement);
  }

/**
 * Força um clique com base no seletor
 * @param {object} page - A página atual.
 * @param {string} select - Item a ser clicado.
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

}

