import { expect } from 'chai';
import { TIME, PROTOCOL_STATUS, SERVICES } from '../../config/constant.mjs';
import { getAppPage } from "../../service/loginSetup.mjs";

import { create } from "../../service/dcService/create.mjs";
import { mockDc } from '../../helpers/mock.js';

import protocolLogger from '../../service/ProtocolCSVLogger.js';
import ApiInterfaceService from '../../core/api-de-interface-clientes.js';

let wallet;

describe("DC Test", function () {
    this.timeout(TIME.FOUR_MINUTES);

    before(async () => {
       //wallet = (await ApiInterfaceService.getWalletsByCode(13))[0];
    });

    it.skip('You must fill in the fields and send it for registration', async () => {
        const page = await getAppPage();
        const formData = mockDc();
        //formData.wallet = wallet.wallet_id;
       
        const { successMessage, protocolData } = await create(page, formData);

        expect(successMessage).to.include('DCS enviado para registro com sucesso!');
        expect(protocolData).to.not.be.null;
        protocolLogger.addProtocol(protocolData, PROTOCOL_STATUS.FINISHED, SERVICES.CDCA);
    });
});
