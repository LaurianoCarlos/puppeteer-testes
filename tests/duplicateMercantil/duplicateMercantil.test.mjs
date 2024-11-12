import { expect } from 'chai';
import { TIME } from '../../config/constant.mjs';
import { setup, closeBrowser } from "../../service/loginSetup.mjs";
import { searchWalletsParticipant, findWalletsParticipant } from './searchWalletsParticipant.mjs';
import { createDuplicateMercantil } from './createDuplicateMercantil.mjs';
import { fetchProtocol } from '../../core/api-de-interface-clientes.js';

let page;

const formData = {
    occurrence: "1",
    mainParticipantCnpj: "26.685.422/0001-31",
    wallet: "",
    externalReference: "12344",
    contractId: "4354345",
    assetId: "115129012",
    holderDocumentType: "1",
    holderDocument: "12345678901234",
    holderZipcode: "42443342",
    holderDomicile: "Endereço Titular",

    newHolderDocumentType: "1",
    newHolderDocument: "22222222222222",
    newHolderZipcode: "42443342",
    newHolderDomicile: "Endereço Novo Titular",
    assetValueTransfer: "1000",
    assetDateTransfer: "2023-01-01",  

    fiduciaryDocumentType: "2",
    fiduciaryDocument: "12345678901",
    fiduciaryZipcode: "42443342",
    fiduciaryDomicile: "Endereço Fiduciário",

    payerDebtorDocumentType: "2",
    payerDebtorDocument: "12345678901",
    payerDebtorZipcode: "42443342",
    payerDebtorDomicile: "teste",

    issuanceDate: "2023-06-28",  
    assetValue: "777777.17",
    totalContractValue: "19917.17",
    installmentNumber: "3",
    totalInstallmentNumber: "12",
    assetDueDate: "2023-06-28",  
    ufPayment: "CE",
    invoice: "23220361585865181946550070000222271202203244",

    assetInterestRate: "0",
    monetaryCorrectionIndex: "0",
    penalClause: "0",            
    otherCharges: "0",
    
    alternativeInformation: "Informação alternativa",
    additionalInformation: "100", 
    otrValidationRule: "N/A"   
};


describe("Teste de Duplicata Mercantil", function () {
    this.timeout(TIME.ONE_MINUTE);

    before(async () => {
        page = await setup();
    });

    after(async () => {
        await closeBrowser();
    });

    it('Deve buscar e não retornar carteiras para o participante', async () => {
        const cnpj = '10.100.001/0001-00';
        const { message } = await searchWalletsParticipant(page, cnpj);
        expect(message).to.be.oneOf([
            'Participante não encontrado ou sem permissão para esse usuário',
            'Não existe carteiras para esse participante',
        ]);
    });

    it('Deve buscar e retornar carteiras disponíveis para o participante', async () => {
        const cnpj = formData.mainParticipantCnpj;
        const wallets = await findWalletsParticipant(page, cnpj);
        expect(wallets).to.be.an('array').that.is.not.empty;
    });

    it('Deve preencher todos os campos do formulario e envia para registro', async () => {
        formData.wallet ='9be2c324-315d-46f6-83af-56f779f02397';
        const { successMessage, protocolData } = await createDuplicateMercantil(page, formData);
        expect(successMessage).to.include('Duplicata Mercantil enviada para registro com sucesso!');
        expect(protocolData).to.not.be.null;
    })

    it('Deve preencher todos os campos do formulario enviar para registro e retornar um protocolo', async () => {
        formData.wallet ='9be2c324-315d-46f6-83af-56f779f02397';
        const { successMessage, protocolData } = await createDuplicateMercantil(page, formData);
        expect(successMessage).to.include('Duplicata Mercantil enviada para registro com sucesso!');
        expect(protocolData).to.not.be.null;

        const fetchedProtocol = await fetchProtocol(protocolData.protocolId, page);
        expect(fetchedProtocol.protocol_id).to.equal(protocolData.protocolId);
    })

})



