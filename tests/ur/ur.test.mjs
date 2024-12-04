import { expect } from 'chai';
import { TIME, PROTOCOL_STATUS, SERVICES } from '../../config/constant.mjs';
import { getAppPage } from "../../service/loginSetup.mjs";
import { create } from "../../service/urService/create.mjs";
import protocolLogger from '../../service/ProtocolCSVLogger.js';
import ApiInterfaceService from '../../core/api-de-interface-clientes.js';


describe("UR Test", function () {
    this.timeout(TIME.FOUR_MINUTES);

    it.skip('You must fill in the fields and send it for registration', async () => {
        const page = await getAppPage();
        const accreditor = (await ApiInterfaceService.getAccreditors())[0];

        const formData = {
            accreditor_document_number: accreditor.cnpj,
            document_type: 'CNPJ',
            document_number: accreditor.cnpj,
            account: {
                agency: '1234',
                number: '56789',
                digit: '0',
                type: 'Corrente',
                ispb: '00000000',
                document_type: 'CNPJ',
                document_number: '12345678000123'
            },
            occurrence: '001',
            external_reference: '20241022',
            holder_document_number: '12345678000123',
            value: '1000.00',
            pre_paid_value: '500.00',
            due_date: '2024-12-31',
            arrangement: 'PIX'
        };

        const { successMessage, protocolData } = await create(page, formData);

        expect(successMessage).to.include('UR enviada para registro com sucesso!');
        expect(protocolData).to.not.be.null;

        protocolLogger.addProtocol(protocolData, PROTOCOL_STATUS.OPENED, SERVICES.UR);
    });
});
