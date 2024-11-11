import { expect } from 'chai';
import { TIME } from '../../config/constant.mjs';
import { setup, closeBrowser } from '../../service/loginSetup.mjs';
import { searchProtocolById } from './searchById.mjs';
import { searchProtocolByStatus } from './searchProtocolByStatus.mjs';
import { searchProtocolsByDateRange} from './searchProtocolsByDateRange.mjs';
import { searchAllProtocols, searchProtocolsByAllFilters } from './searchAllProtocol.mjs';

let page;

describe('Testes busca por Protocolo', function () {
  this.timeout(TIME.TWO_MINUTES);

  before(async () => {
    page = await setup();
  });

  after(async () => {
    await closeBrowser();
  });

  it('Deve encontrar o protocolo pelo ID', async () => {
    const protocolId = '9d6d22a3-d4a2-462e-8812-5ac42301f6b1';
    const results = await searchProtocolById(page, protocolId);
    expect(results.some(result => result.includes(protocolId))).to.be.true;
  });

  it('Não deve encontrar um protocolo com ID inexistente', async () => {
    const protocolId = 'xx1555xx-70fa-4a1e-bbfe-123456789';
    const results = await searchProtocolById(page, protocolId);
    expect(results.some(result => result.includes(protocolId))).to.be.false;
  });


   it('Não deve encontrar o protocolo pelo status "Em Aberto"', async () => {
    const status = 'opened';
    const results = await searchProtocolByStatus(page, status);
    expect(results.some(result => result.includes('Em Aberto'))).to.be.not;
  });

 
  it('Deve encontrar o protocolo pelo status "Finalizado"', async () => {
    const status = 'finished';
    const results = await searchProtocolByStatus(page, status);
    expect(results.some(result => result.includes('FINALIZADO'))).to.be.true;
  });

  it('Deve encontrar o protocolo pelo status "Cancelado"', async () => {
    const status = 'cancelled';
    const results = await searchProtocolByStatus(page, status);
    expect(results.some(result => result.includes('CANCELADO'))).to.be.true;
  });

  it('Deve encontrar protocolos dentro do intervalo de datas', async () => {
    const startDate = '2020-10-01';
    const endDate = '2024-11-01';
    const results = await searchProtocolsByDateRange(page, startDate, endDate);
    expect(results.length).to.be.greaterThan(1);
  });

  it('Deve encontrar todos os protocolos', async () => {
    const results = await searchAllProtocols(page);
    expect(results.length).to.be.greaterThan(10);
  })

  it('Deve encontrar protocolos que correspondem a todos os filtros aplicados', async () => {
    const status = 'cancelled';
    const startDate = '2020-10-01';
    const endDate = '2024-11-01';
    const results = await searchProtocolsByAllFilters(page, status, startDate, endDate);
    expect(results.length).to.be.greaterThan(0);
    expect(results.every(result => result.includes('CANCELADO'))).to.be.true;
  });
});
