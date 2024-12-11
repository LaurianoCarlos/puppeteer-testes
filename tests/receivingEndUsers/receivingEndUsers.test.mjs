import { expect } from 'chai';
import { mockReceivingEndUsers } from '../../helpers/mock.js';
import { TIME, PROTOCOL_STATUS, SERVICES } from '../../config/constant.mjs';
import { getAppPage } from "../../service/loginSetup.mjs";
import { create } from "../../service/receivingEndUsersService/create.mjs";
import protocolLogger from '../../service/ProtocolCSVLogger.js';
import ApiInterfaceService from '../../core/api-de-interface-clientes.js';


describe("Receivable End Users Test", function () {
    this.timeout(TIME.FOUR_MINUTES);

    it('You must fill in the fields and send it for registration', async () => {
        const page = await getAppPage();
        const accreditor = (await ApiInterfaceService.getAccreditors())[0];

        const formData = await mockReceivingEndUsers();
        formData.accreditor_document_number = accreditor.cnpj;

        const { successMessage, protocolData } = await create(page, formData);

        expect(successMessage).to.include('Usuário Final Recebedor enviado para registro com sucesso!');
        expect(protocolData).to.not.be.null;

        protocolLogger.addProtocol(protocolData, PROTOCOL_STATUS.FINISHED, SERVICES.RECEIVING_END_USERS);
    });
});
