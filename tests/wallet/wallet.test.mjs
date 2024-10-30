import { expect } from 'chai';
import { setup, closeBrowser } from '../loginSetup.mjs';
import { searchWalletById, searchWalletByIdNotFound } from './searchById.mjs';
import { searchWalletByName, searchWalletByNameNotFound } from './searchByWallet.mjs';
import { createWallet } from './createWallet.mjs';

let page;

describe('Wallet Search Tests', function () {
  this.timeout(60000);

  before(async () => {
    page = await setup(); // Chama a configuração global
  });

  // Fecha o navegador após todos os testes
  after(async () => {
    await closeBrowser();
  });

  // Teste para verificar a busca pelo ID existente
  it('Deve encontrar a carteira pelo ID', async () => {
    const walletId = '9d5c7c1d-70fa-4a1e-bbfe-fb1f6e68361e';
    const results = await searchWalletById(page, walletId);
    expect(results.some(result => result.includes(walletId))).to.be.true;
  });

  // Teste para verificar a busca pelo ID inexistente
  it('Não deve encontrar uma carteira com ID inexistente', async () => {
    const walletId = 'xx1555xx-70fa-4a1e-bbfe-123456789';
    const results = await searchWalletByIdNotFound(page, walletId);
    expect(results.some(result => result.includes(walletId))).to.be.false;
  });


  // Teste para verificar a busca pelo Nome da Carteira existente
  it('Deve encontrar a carteira pelo Nome', async () => {
    const walletName = 'carteira de teste de contrato';
    const results = await searchWalletByName(page, walletName);
    expect(results.some(result => result.includes(walletName))).to.be.true;
  });

  // Teste para verificar a busca pelo Nome da carteira inexistente
  it('Não deve encontrar uma carteira com o Nome inexistente', async () => {
    const walletName = 'nome da carteira';
    const results = await searchWalletByNameNotFound(page, walletName);
    expect(results.some(result => result.includes(walletName))).to.be.false;
  });

/*
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
*/
});
