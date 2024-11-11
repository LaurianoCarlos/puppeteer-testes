import { DUPLICATE_MERCANTIL_CREATE_BASE } from '../../config/constant.mjs';
import { getProtocol, expandSectionIfCollapsed } from '../../helpers/helpers.js';

export async function createDuplicateMercantil(page, formData) {
    await page.goto(DUPLICATE_MERCANTIL_CREATE_BASE);

    /* DADOS DA AÇÃO */
    await page.waitForSelector('#collapseActionData', { visible: true });
    await page.select('#occurrence', formData.occurrence);
    await page.type('#main_participant_cnpj', formData.mainParticipantCnpj);
    /*await page.waitForSelector('#searchWalletsParticipant', { visible: true });
    await page.evaluate(() => {
        document.querySelector('#searchWalletsParticipant').click();
    });
    await page.waitForSelector('#wallet option:not([value=""])', { visible: true });

    const firstOptionValue = await page.$eval('#wallet option:not([value=""])', option => option.value);
    await page.select('#wallet', firstOptionValue);*/

    /* IDENTIFICADORES */
    await expandSectionIfCollapsed(page, '#collapseIdentifiers', 'button[aria-controls="collapseIdentifiers"]');
    await page.type('#contract_id', formData.contractId);
    await page.type('#asset_id', formData.assetId);

    /* TITULAR */
    await expandSectionIfCollapsed(page, '#collapseHolder', 'button[aria-controls="collapseHolder"]');
    await page.select('#holder_document_type', formData.holderDocumentType);
    await page.type('#holder_document', formData.holderDocument);
    await page.type('#holder_zipcode', formData.holderZipcode);
    await page.type('#holder_domicile', formData.holderDomicile);

    /* NOVO TITULAR */
    await expandSectionIfCollapsed(page, '#collapseNewHolder', 'button[aria-controls="collapseNewHolder"]');
    await page.select('#new_holder_document_type', formData.newHolderDocumentType);
    await page.type('#new_holder_document', formData.newHolderDocument);
    await page.type('#new_holder_zipcode', formData.newHolderZipcode);
    await page.type('#new_holder_domicile', formData.newHolderDomicile);
    await page.type('#asset_value_transfer', formData.assetValueTransfer);
    await page.type('#asset_date_transfer', formData.assetDateTransfer);

    /* FIDUCIÁRIO */
    await expandSectionIfCollapsed(page, '#collapseFiduciary', 'button[aria-controls="collapseFiduciary"]');
    await page.select('#fiduciary_document_type', formData.fiduciaryDocumentType);
    await page.type('#fiduciary_document', formData.fiduciaryDocument);
    await page.type('#fiduciary_zipcode', formData.fiduciaryZipcode);
    await page.type('#fiduciary_domicile', formData.fiduciaryDomicile);

    /* PAGADOR/DEVEDOR */
    await expandSectionIfCollapsed(page, '#collapsePayerDebtor', 'button[aria-controls="collapsePayerDebtor"]');
    await page.select('#payer_or_debtor_document_type', formData.payerDebtorDocumentType);
    await page.type('#payer_or_debtor_document', formData.payerDebtorDocument);
    await page.type('#payer_or_debtor_zipcode', formData.payerDebtorZipcode);
    await page.type('#payer_or_debtor_domicile', formData.payerDebtorDomicile);

    /* DADOS DOS ATIVOS */
    await expandSectionIfCollapsed(page, '#collapseAssetData', 'button[aria-controls="collapseAssetData"]');
    await page.type('#issuance_date', formData.issuanceDate);
    await page.type('#asset_value', formData.assetValue);
    await page.type('#total_contract_value', formData.totalContractValue);
    await page.type('#installment_number', formData.installmentNumber);
    await page.type('#total_installment_number', formData.totalInstallmentNumber);
    await page.type('#asset_due_date', formData.assetDueDate);
    await page.type('#uf_payment', formData.ufPayment);
    await page.type('#invoice', formData.invoice);

    /* OUTRAS INFORMAÇÔES */
    await expandSectionIfCollapsed(page, '#collapseOtherInformation', 'button[aria-controls="collapseOtherInformation"]');
    await page.type('#alternative_information', formData.alternativeInformation);
    await page.type('#asset_interest_rate', formData.assetInterestRate);
    await page.type('#monetary_correction_index', formData.monetaryCorrectionIndex);
    await page.type('#penal_clause', formData.penalClause);
    await page.type('#other_charges', formData.otherCharges);
    await page.type('#additional_information', formData.additionalInformation);
    await page.type('#otr_validation_rule', formData.otrValidationRule);

    /* SUBMISSÃO DO FORMULÁRIO */
    await page.waitForSelector('button[type="submit"]', { timeout: 10000 });
    await page.evaluate(() => {
        document.querySelector('button[type="submit"]').click();
    });

    await page.waitForSelector('.toast-success', { timeout: 20000 });

    const successMessage = await page.evaluate(() => {
        const toast = document.querySelector('.toast-success');
        return toast ? toast.innerText : null;
    });
    
    const protocolData = await getProtocol(page);
      
    return { successMessage, protocolData };
}
