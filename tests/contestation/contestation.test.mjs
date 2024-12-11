import { expect } from 'chai';
import { TIME, PROTOCOL_STATUS, SERVICES } from '../../config/constant.mjs';
import { getAppPage } from "../../service/loginSetup.mjs";
import { create } from "../../service/contestationService/create.mjs";
import protocolLogger from '../../service/ProtocolCSVLogger.js';
import { mockContestation } from '../../helpers/mock.js';

describe("Contestation Test", function () {
    this.timeout(TIME.FOUR_MINUTES);

    it('You must fill in the fields and send it for registration', async () => {
        const page = await getAppPage();
        const formData = mockContestation();
        
        const { successMessage, protocolData } = await create(page, formData);

        expect(successMessage).to.include('Contestação enviada para registro com sucesso!');
        expect(protocolData).to.not.be.null;

        protocolLogger.addProtocol(protocolData, PROTOCOL_STATUS.FINISHED, SERVICES.CONTESTATION);
    });
});
