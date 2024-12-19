import { expect } from 'chai';
import { uuid, genericName, mockWallet } from '../../helpers/mock.js'
import { PER_PAGE, PROTOCOL_STATUS, ROUTE, SERVICES } from '../../config/constant.mjs';
import { getAppPage, closeBrowser } from '../../service/loginSetup.mjs';
import { searchById } from '../../service/walletService/searchById.mjs';
import { searchByName } from '../../service/walletService/searchByWallet.mjs';
import { create } from '../../service/walletService/create.mjs';
import protocolLogger from '../../service/ProtocolCSVLogger.js';

import ApiInterfaceService from '../../core/api-de-interface-clientes.js';
import { DataTableService } from '../../service/DataTableService.mjs';




let wallet;

describe('Wallet Search Test', function () {

  before(async () => {
    wallet = (await ApiInterfaceService.getWallets())[0];
  });

  after(async () => {
    await closeBrowser();
  });

  Object.entries(PER_PAGE).forEach(([key, value]) => {
    it(`Must change the number of records per page: PerPage: ${value}`, async () => {
      const page = await getAppPage();
      const { quantity, message } = await DataTableService.perPage(
        page,
        value,
        ROUTE.WALLET_SEARCH_BASE
      );

      expect(quantity).to.equal(value);
      expect(message).to.include(`Exibindo ${value} registros por página`);
    });
  });

  it('Must navigate to next page', async () => {
    const page = await getAppPage();

    const isPreviousEnabled = await DataTableService.goToNextPage(page, ROUTE.WALLET_SEARCH_BASE);
    expect(isPreviousEnabled).to.be.true;
  });

  it('Must load a specific page', async () => {
    const page = await getAppPage();
    const isLoaded = await DataTableService.goToPage(page, 2, ROUTE.WALLET_SEARCH_BASE);
    expect(isLoaded).to.be.true;
  });

  it('Must change the number of records per pages', async () => {
    const page = await getAppPage();
    const value = '500';
    const { quantity, message } = await DataTableService.perPage(page, value, ROUTE.WALLET_SEARCH_BASE);

    expect(quantity).equals(value);
    expect(message).to.include(`Exibindo ${value} registros por página`);
  });

  it('Must check CSV download', async () => {
    const page = await getAppPage();

    const isDownload = await DataTableService.verifyLoadingCsv(page, ROUTE.WALLET_SEARCH_BASE);
    expect(isDownload).to.be.true;
  });

  it('Should find a Wallet by ID', async () => {
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
    const walletData = await mockWallet();
    const { successMessage, protocolData } = await create(page, walletData);

    expect(successMessage).to.include('Carteira enviada para registro com sucesso!')
    expect(protocolData).to.not.be.null;

    protocolLogger.addProtocol(protocolData, PROTOCOL_STATUS.FINISHED, SERVICES.WALLET);
  })

});
