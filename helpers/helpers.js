export async function getProtocol(page) {
    
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

  export async function expandSectionIfCollapsed(page, selector, controlButtonSelector) {
    const isCollapsed = await page.$eval(selector, el => el.classList.contains('collapse'));
    if (isCollapsed) {
        await page.click(controlButtonSelector);
    }
    await page.waitForSelector(`${selector}.show`, { visible: true });
}

// Função para verificar a buscar no dataTable

export async function waitForLoading(page) {
  await page.waitForFunction(() => {
    const loadingRow = document.querySelector('tr[wire\\:loading\\.class\\.remove="c-hidden"]');
    return loadingRow && !loadingRow.classList.contains('c-hidden');
  }, { timeout: 60000 });

  await page.waitForFunction(() => {
    const loadingRow = document.querySelector('tr[wire\\:loading\\.class\\.remove="c-hidden"]');
    return loadingRow && loadingRow.classList.contains('c-hidden');
  }, { timeout: 60000 });
}

// Função para obter os resultados da tabela

export async function getTableResults(page) {
  return await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.card-datatable tbody tr'))
      .map(row => row.innerText.trim())
      .filter(text => text.length > 0 && !text.includes('Carregando') && !text.includes('Atualizando'));
  });
}

  