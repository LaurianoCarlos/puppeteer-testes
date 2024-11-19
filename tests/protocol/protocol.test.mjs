import { expect } from 'chai';
import { uuid } from '../../helpers/mock';
import { PROTOCOL_STATUS } from '../../config/constant.mjs';
import { getAppPage, closeBrowser } from '../../service/loginSetup.mjs';
import { searchProtocolById } from '../../service/protocolService/searchById.mjs';
import { searchProtocolByStatus } from './searchProtocolByStatus.mjs';
import { searchProtocolsByDateRange } from './searchProtocolsByDateRange.mjs';
import { searchAllProtocols, searchProtocolsByAllFilters } from './searchAllProtocol.mjs';

import ApiInterfaceService from '../../core/api-de-interface-clientes';

let protocol;

describe('Protocol search tests', function () {

  before(async () => {
    protocol = (await ApiInterfaceService.getProtocols())[0];
  });

  after(async () => {
    await closeBrowser();
  });

  it('should find the protocol by ID', async () => {
    const page = getAppPage();
    const results = await searchProtocolById(page, protocol.asset_uuid);
    
    expect(results.some(result => result.includes(protocol.asset_uuid))).to.be.true;
  });

  it('Shold not find a protocol with a not-existent ID', async () => {
    const page = getAppPage();
    const protocolId = uuid();
    const results = await searchProtocolById(page, protocolId);

    expect(results.some(result => result.includes(protocolId))).to.be.false;
  });

  it('Should not find the protocol with status "Em Aberto"', async () => {
    const page = getAppPage();
    const results = await searchProtocolByStatus(page, PROTOCOL_STATUS.OPENED);

    expect(results.some(result => result.includes('Em Aberto'))).to.be.not;
  });


  it('Should find the protocol with status "Finalizado"', async () => {
    const page = getAppPage();
    const results = await searchProtocolByStatus(page, PROTOCOL_STATUS.FINISHED);

    expect(results.some(result => result.includes('FINALIZADO'))).to.be.true;
  });

  it('Should find the protocol with status "Cancelado"', async () => {
    const page = getAppPage();
    const results = await searchProtocolByStatus(page, PROTOCOL_STATUS.CANCELLED);

    expect(results.some(result => result.includes('CANCELADO'))).to.be.true;
  });

  it('Should find protocols within the date range', async () => {
    const page = getAppPage();
    const startDate = '2020-01-01';
    const endDate = '2030-01-01';
    const results = await searchProtocolsByDateRange(page, startDate, endDate);

    expect(results.length).to.be.greaterThan(1);
  });

  it('Should find all protocols', async () => {
    const page = getAppPage();
    const results = await searchAllProtocols(page);

    expect(results).to.be.not.null;
    expect(results.length).to.be.greaterThan(10);
  })

  it('Should find protocols matching all applied filters', async () => {
    const page = getAppPage();
    const startDate = '2020-01-01';
    const endDate = '2030-01-01';
    const results = await searchProtocolsByAllFilters(page, PROTOCOL_STATUS.CANCELLED, startDate, endDate);

    expect(results.length).to.be.greaterThan(0);
    expect(results.every(result => result.includes('CANCELADO'))).to.be.true;
  });

});
