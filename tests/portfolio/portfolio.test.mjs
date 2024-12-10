import { expect } from 'chai';
import { TIME, PROTOCOL_STATUS, SERVICES } from '../../config/constant.mjs';
import { getAppPage } from "../../service/loginSetup.mjs";
import { create } from "../../service/portfolioService/create.mjs";
import { mockPortfolio } from '../../helpers/mock.js';
import protocolLogger from '../../service/ProtocolCSVLogger.js';

describe("CDCA Portfólio Test", function () {
    this.timeout(TIME.FOUR_MINUTES);

    it.only('You must fill in the fields and send it for registration', async () => {
        const page = await getAppPage();
        const formData = mockPortfolio();

        const { successMessage, protocolData } = await create(page, formData);

        expect(successMessage).to.include('Portfólio enviado para registro com sucesso!');
        expect(protocolData).to.not.be.null;
        protocolLogger.addProtocol(protocolData, PROTOCOL_STATUS.FINISHED, SERVICES.CDCA);
    });
});
