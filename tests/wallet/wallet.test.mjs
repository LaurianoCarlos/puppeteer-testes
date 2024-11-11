import { expect } from 'chai';
import { TIME } from '../../config/constant.mjs';
import { setup, closeBrowser } from '../../service/loginSetup.mjs';
import { searchWalletById, searchWalletByIdNotFound } from './searchById.mjs';
import { searchWalletByName, searchWalletByNameNotFound } from './searchByWallet.mjs';
import { createWallet } from './createWallet.mjs';
import { fetchProtocol } from '../../core/api-de-interface-clientes.js';

let page;

describe('Wallet Search Tests', function () {
  this.timeout(TIME.TWO_MINUTES);

  before(async () => {
    page = await setup();
  });


  after(async () => {
    await closeBrowser();
  });

  it('Deve encontrar a carteira pelo ID', async () => {
    const walletId = '9d5c7c1d-70fa-4a1e-bbfe-fb1f6e68361e';
    const results = await searchWalletById(page, walletId);
    expect(results.some(result => result.includes(walletId))).to.be.true;
  });

  it('Não deve encontrar uma carteira com ID inexistente', async () => {
    const walletId = 'xx1555xx-70fa-4a1e-bbfe-123456789';
    const results = await searchWalletByIdNotFound(page, walletId);
    expect(results.some(result => result.includes(walletId))).to.be.false;
  });


  it('Deve encontrar a carteira pelo Nome', async () => {
    const walletName = 'carteira de teste de contrato';
    const results = await searchWalletByName(page, walletName);
    expect(results.some(result => result.includes(walletName))).to.be.true;
  });

  it('Não deve encontrar uma carteira com o Nome inexistente', async () => {
    const walletName = 'nome da carteira';
    const results = await searchWalletByNameNotFound(page, walletName);
    expect(results.some(result => result.includes(walletName))).to.be.false;
  });

  it('Deve criar uma nova carteira com sucesso', async () => {
    const walletData = {
      name: 'carteira de teste front',
      description: 'descrição da carteira teste',
      achievementId: '1'
    };

    const { successMessage, protocolData } = await createWallet(page, walletData);

    expect(successMessage).to.include('Carteira enviada para registro com sucesso!')
    expect(protocolData).to.not.be.null;
  })


  it('Deve criar uma nova carteira com sucesso e gerar um protocolo com sucesso', async () => {
    const walletData = {
      name: 'carteira de teste front',
      description: 'descrição da carteira teste',
      achievementId: '1'
    };

    const { successMessage, protocolData } = await createWallet(page, walletData);

    expect(successMessage).to.include('Carteira enviada para registro com sucesso!')
    expect(protocolData).to.not.be.null;
    
    const fetchedProtocol = await fetchProtocol(protocolData.protocolId, page);
    expect(fetchedProtocol.protocol_id).to.equal(protocolData.protocolId);
  })
});
