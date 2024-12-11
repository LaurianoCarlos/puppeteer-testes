import { expect } from 'chai';
import { TIME, PROTOCOL_STATUS, SERVICES } from '../../config/constant.mjs';
import { getAppPage } from "../../service/loginSetup.mjs";
import { create } from "../../service/urService/create.mjs";
import protocolLogger from '../../service/ProtocolCSVLogger.js';

import { mockUr } from '../../helpers/mock.js';


describe("UR Test", function () {
    this.timeout(TIME.FOUR_MINUTES);

    it.only('You must fill in the fields and send it for registration', async () => {
        const page = await getAppPage();
        
        const formData = mockUr();
        formData.accreditor_document_number =  "01027058000191";
        formData.document_number =  "33473635000164";

        const { successMessage, protocolData } = await create(page, formData);

        expect(successMessage).to.include('UR enviada para registro com sucesso!');
        expect(protocolData).to.not.be.null;

        protocolLogger.addProtocol(protocolData, PROTOCOL_STATUS.OPENED, SERVICES.UR);
    });
});
