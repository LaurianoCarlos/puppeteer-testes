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
  