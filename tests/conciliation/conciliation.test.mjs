import { expect } from 'chai';
import { TIME, PROTOCOL_STATUS, SERVICES } from '../../config/constant.mjs';
import { getAppPage } from "../../service/loginSetup.mjs";
import { create } from "../../service/conciliation/create.mjs";
import protocolLogger from '../../service/ProtocolCSVLogger.js';
import { mockConciliation } from '../../helpers/mock.js';

import ApiInterfaceService from '../../core/api-de-interface-clientes.js';

describe("Conciliation Test", function () {
    this.timeout(TIME.FOUR_MINUTES);

    it('You must fill in the fields and send it for registration', async () => {
        const page = await getAppPage();
        const conciliation = (await ApiInterfaceService.getConciliation())[0];

        const formData = mockConciliation();
        formData.wallet = conciliation.values[0].wallet;

        const { successMessage, protocolData } = await create(page, formData);

        expect(successMessage).to.include('Conciliação enviada para registro com sucesso!');
        expect(protocolData).to.not.be.null;

        protocolLogger.addProtocol(protocolData, PROTOCOL_STATUS.FINISHED, SERVICES.CONCILIATION);
    });
});
