import { DUPLICATE_MERCANTIL_CREATE_BASE, TIME } from '../../config/constant.mjs';
import { Utils } from '../../helpers/Utils.js';


export async function create(page, formData) {
    await page.goto(DUPLICATE_MERCANTIL_CREATE_BASE);

    /* DADOS DA AÇÃO */
    await page.waitForSelector('#collapseActionData', { visible: true });
    await page.select('#occurrence', formData.occurrence);
    await page.waitForSelector('#main_participant_cnpj', { visible: true });
    await page.evaluate((cnpjValue) => {
        const cnpjField = document.querySelector('#main_participant_cnpj');
        cnpjField.value = cnpjValue;
        cnpjField.dispatchEvent(new Event('input', { bubbles: true }));
    }, formData.mainParticipantCnpj);

    await page.waitForSelector('#searchWalletsParticipant', { visible: true });
    await page.evaluate(() => document.querySelector('#searchWalletsParticipant').click());

    await page.waitForFunction(() => {
        const walletField = document.querySelector('#wallet');
        return walletField && !walletField.disabled;
    }, { timeout: TIME.ONE_MINUTE });

    await page.select('#wallet', formData.wallet);
    await page.type('#external_reference', formData.externalReference);

    /* IDENTIFICADORES */
    await Utils.expandSectionIfCollapsed(page, '#collapseIdentifiers', 'button[aria-controls="collapseIdentifiers"]');
    await page.waitForSelector('#contract_id', { visible: true });
    await page.type('#contract_id', formData.contractId);
    await page.type('#asset_id', formData.assetId);

    /* TITULAR */
    await Utils.expandSectionIfCollapsed(page, '#collapseHolder', 'button[aria-controls="collapseHolder"]');
    await page.waitForSelector('#holder_document_type', { visible: true });
    await page.select('#holder_document_type', formData.holderDocumentType);
    await page.type('#holder_document', formData.holderDocument);
    await page.type('#holder_zipcode', formData.holderZipcode);
    await page.type('#holder_domicile', formData.holderDomicile);

    /* NOVO TITULAR */
    await Utils.expandSectionIfCollapsed(page, '#collapseNewHolder', 'button[aria-controls="collapseNewHolder"]');
    await page.waitForSelector('#new_holder_document_type', { visible: true });
    await page.select('#new_holder_document_type', formData.newHolderDocumentType);
    await page.type('#new_holder_document', formData.newHolderDocument);
    await page.type('#new_holder_zipcode', formData.newHolderZipcode);
    await page.type('#new_holder_domicile', formData.newHolderDomicile);
    await page.type('#asset_value_transfer', formData.assetValueTransfer);
    await page.type('#issuance_date', formData.issuanceDate);

    /* FIDUCIÁRIO */
    await Utils.expandSectionIfCollapsed(page, '#collapseFiduciary', 'button[aria-controls="collapseFiduciary"]');
    await page.waitForSelector('#fiduciary_document_type', { visible: true });
    await page.select('#fiduciary_document_type', formData.fiduciaryDocumentType);
    await page.type('#fiduciary_document', formData.fiduciaryDocument);
    await page.type('#fiduciary_zipcode', formData.fiduciaryZipcode);
    await page.type('#fiduciary_domicile', formData.fiduciaryDomicile);

    /* PAGADOR/DEVEDOR */
    await Utils.expandSectionIfCollapsed(page, '#collapsePayerDebtor', 'button[aria-controls="collapsePayerDebtor"]');
    await page.waitForSelector('#payer_or_debtor_document_type', { visible: true });
    await page.select('#payer_or_debtor_document_type', formData.payerDebtorDocumentType);
    await page.type('#payer_or_debtor_document', formData.payerDebtorDocument);
    await page.type('#payer_or_debtor_zipcode', formData.payerDebtorZipcode);
    await page.type('#payer_or_debtor_domicile', formData.payerDebtorDomicile);

    /* DADOS DOS ATIVOS */
    await Utils.expandSectionIfCollapsed(page, '#collapseAssetData', 'button[aria-controls="collapseAssetData"]');
    await page.waitForSelector('#issuance_date', { visible: true });
    await page.type('#issuance_date', formData.assetDueDate);
    await page.type('#asset_value', formData.assetValue);
    await page.type('#total_contract_value', formData.totalContractValue);
    await page.type('#installment_number', formData.installmentNumber);
    await page.type('#total_installment_number', formData.totalInstallmentNumber);
    await page.type('#asset_due_date', formData.assetDueDate);
    await page.type('#uf_payment', formData.ufPayment);
    await page.type('#invoice', formData.invoice);

    /* OUTRAS INFORMAÇÔES */
    await Utils.expandSectionIfCollapsed(page, '#collapseOtherInformation', 'button[aria-controls="collapseOtherInformation"]');
    await page.waitForSelector('#alternative_information', { visible: true });
    await page.type('#alternative_information', formData.alternativeInformation);
    await page.type('#asset_interest_rate', formData.assetInterestRate);
    await page.type('#monetary_correction_index', formData.monetaryCorrectionIndex);
    await page.type('#penal_clause', formData.penalClause);
    await page.type('#other_charges', formData.otherCharges);
    await page.type('#additional_information', formData.additionalInformation);
    await page.type('#otr_validation_rule', formData.otrValidationRule);

    await page.waitForSelector('button[type="submit"]', { visible: true });
    await page.evaluate(() => document.querySelector('button[type="submit"]').click());

    await page.waitForSelector('.toast-success', { visible: true, timeout: TIME.TWO_MINUTES });

    const successMessage = await Utils.getToastrMessage(page);
    const protocolData = await Utils.getProtocol(page);;

    return { successMessage, protocolData };
}
