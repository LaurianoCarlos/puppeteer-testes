import { expect } from 'chai';
import { uuid } from '../../helpers/mock.js';
import { PROTOCOL_STATUS } from '../../config/constant.mjs';
import { getAppPage } from '../../service/loginSetup.mjs';
import { searchById } from '../../service/protocolService/searchById.mjs';
import { searchByStatus } from '../../service/protocolService/searchByStatus.mjs';
import { searchByDateRange } from '../../service/protocolService/searchByDateRange.mjs';
import { searchAll, searchByAllFilters } from '../../service/protocolService/searchAll.mjs';

import ApiInterfaceService from '../../core/api-de-interface-clientes.js';

let protocol;

describe('Protocol search Test', function () {
  before(async () => {
    protocol = (await ApiInterfaceService.getProtocols())[0];
  });

  it('should find the protocol by ID', async () => {
    const page = await getAppPage();
    const results = await searchById(page, protocol.protocol_id);
    
    expect(results.some(result => result.includes(protocol.protocol_id))).to.be.true;
  });

  it('Shold not find a protocol with a not-existent ID', async () => {
    const page = await getAppPage();
    const protocolId = uuid();
    const results = await searchById(page, protocolId);

    expect(results.some(result => result.includes(protocolId))).to.be.false;
  });

  it('Should not find the protocol with status "Em Aberto"', async () => {
    const page = await getAppPage();
    const results = await searchByStatus(page, PROTOCOL_STATUS.OPENED);

    expect(results.some(result => result.includes('Em Aberto'))).to.be.not;
  });


  it('Should find the protocol with status "Finalizado"', async () => {
    const page = await getAppPage();
    const results = await searchByStatus(page, PROTOCOL_STATUS.FINISHED);

    expect(results.some(result => result.includes('FINALIZADO'))).to.be.true;
  });

  it('Should find the protocol with status "Cancelado"', async () => {
    const page = await getAppPage();
    const results = await searchByStatus(page, PROTOCOL_STATUS.CANCELLED);

    expect(results.some(result => result.includes('CANCELADO'))).to.be.true;
  });

  it('Should find protocols within the date range', async () => {
    const page = await getAppPage();
    const startDate = '01-01-2020';
    const endDate = '01-01-2030';
    const results = await searchByDateRange(page, startDate, endDate);
  
    expect(results.length).to.be.greaterThan(1);
  });

  it('Should find all protocols', async () => {
    const page = await getAppPage();
    const results = await searchAll(page);

    expect(results).to.be.not.null;
    expect(results.length).to.be.greaterThan(10);
  })

  it('Should find protocols matching all applied filters', async () => {
    const page = await getAppPage();
    const startDate = '01-01-2020';
    const endDate = '01-01-2030';
    const results = await searchByAllFilters(page, PROTOCOL_STATUS.CANCELLED, startDate, endDate);
   
    expect(results.length).to.be.greaterThan(1);
    expect(results.every(result => result.includes('CANCELADO'))).to.be.true;
  });

});
