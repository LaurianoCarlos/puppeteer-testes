import { expect } from 'chai';
import { setup, closeBrowser } from "../../service/loginSetup.mjs";
import { createDuplicateMercantil } from './createDuplicateMercantil.mjs';

let page;

const formData = {
    occurrence: "1",
    mainParticipantCnpj: "74.704.144/0001-65",
    //wallet: "",
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
    assetValueTransfer: "100",  
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
    monetaryCorrectionIndex: "N/A", 
    penalClause: "N/A", 
    otherCharges: "0", 

    alternativeInformation: "Informação alternativa", 
    assetInterestRate: "0", 
    monetaryCorrectionIndex: "N/A", 
    penalClause: "N/A", 
    otherCharges: "0", 
    additionalInformation: "Informações adicionais", 
    otrValidationRule: "N/A"
};

describe("Teste de Duplicata Mercantil", function () {
    this.timeout(320000);

    before(async () => {
        page = await setup();
    });

    after(async () => {
        await closeBrowser();
    });


    it('Deve preencher todos os campos do formulario', async () => {
       const {successMessage, protocolData} = await createDuplicateMercantil(page, formData);
       expect(successMessage).to.include('Duplicata Mercantil enviada para registro com sucesso!');
       expect(protocolData).to.not.be.null;

       const fetchedProtocol = await fetchProtocol(protocolData.protocolId, page);
       expect(fetchedProtocol.protocol_id).to.equal(protocolData.protocolId);
    })
})



