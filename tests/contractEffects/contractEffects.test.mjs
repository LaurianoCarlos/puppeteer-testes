import { expect } from 'chai';
import { TIME, PROTOCOL_STATUS, SERVICES } from '../../config/constant.mjs';
import { getAppPage } from "../../service/loginSetup.mjs";
import { create } from "../../service/contractEffects/create.mjs";
import protocolLogger from '../../service/ProtocolCSVLogger.js';
import { mockContractEffects } from '../../helpers/mock.js';
import ApiInterfaceService from '../../core/api-de-interface-clientes.js';



describe("Contract Effects Test", function () {
    this.timeout(TIME.FOUR_MINUTES);

    it('You must fill in the fields and send it for registration', async () => {
        const page = await getAppPage();
        const wallet = (await ApiInterfaceService.getWalletsByCode(11))[0];
    
        const formData = mockContractEffects();
        formData.wallet = wallet.wallet_id;
        
        const { successMessage, protocolData } = await create(page, formData);

        expect(successMessage).to.include('Efeito de Contrato enviado para registro com sucesso!');
        expect(protocolData).to.not.be.null;

        protocolLogger.addProtocol(protocolData, PROTOCOL_STATUS.FINISHED, SERVICES.CONTRACT_EFFECTS);
    });
});
