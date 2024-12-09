import { expect } from 'chai';
import { TIME } from '../../config/constant.mjs';
import { uuid, genericName } from '../../helpers/mock.js'
import { PROTOCOL_STATUS, SERVICES } from '../../config/constant.mjs';
import { getAppPage, closeBrowser } from '../../service/loginSetup.mjs';
import { searchById } from '../../service/walletService/searchById.mjs';
import { searchByName } from '../../service/walletService/searchByWallet.mjs';
import { create } from '../../service/walletService/create.mjs';
import protocolLogger from '../../service/ProtocolCSVLogger.js';

import ApiInterfaceService from '../../core/api-de-interface-clientes.js';

let wallet;

describe('Wallet Search Tests', function () {

  before(async () => {
    wallet = (await ApiInterfaceService.getWallets())[0];
    console.log("wallet: ", wallet);
  });

  after(async () => {
    await closeBrowser();
  });

  it.only('Should find a Wallet by ID', async () => {
    const page = await getAppPage();
    const results = await searchById(page, wallet.wallet_id);

    expect(results.some(result => result.includes(wallet.wallet_id))).to.be.true;
  });

  it('Should find a wallet by ID', async () => {
    const page = await getAppPage();
    const walletId = uuid();
    const results = await searchById(page, walletId);

    expect(results.some(result => result.includes(walletId))).to.be.false;
  });

  it('Should find a Wallet by Name', async () => {
    const page = await getAppPage();
    const results = await searchByName(page, wallet.name);

    expect(results.some(result => result.includes(wallet.name))).to.be.true;
  });

  it('Should not find a Wallet by Name', async () => {
    const page = await getAppPage();
    const walletName = genericName();
    const results = await searchByName(page, walletName);

    expect(results.some(result => result.includes(walletName))).to.be.false;
  });

  it('Must create a new wallet successfully and generate a protocol successfully', async () => {
    const page = await getAppPage();
    const walletData = {
      name: genericName(),
      description: genericName(),
      achievementId: '1'
    };
    const { successMessage, protocolData } = await create(page, walletData);

    expect(successMessage).to.include('Carteira enviada para registro com sucesso!')
    expect(protocolData).to.not.be.null;

    protocolLogger.addProtocol(protocolData, PROTOCOL_STATUS.FINISHED, SERVICES.WALLET);
  })

});
