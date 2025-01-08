import { ROUTE } from '../../config/constant.mjs';
import { Utils } from '../../helpers/Utils.js';


/**
 * Preenche a seção "Dados da Ação".
 */
async function fillActionData(page, formData) {
    await page.waitForSelector('#collapseActionData', { visible: true });
    await page.select('#occurrence', formData.occurrence);
    await page.evaluate((cnpjValue) => {
        const cnpjField = document.querySelector('#main_participant_cnpj');
        cnpjField.value = cnpjValue;
        cnpjField.dispatchEvent(new Event('input', { bubbles: true }));
    }, formData.mainParticipantCnpj);
    await page.evaluate(() => document.querySelector('#searchWalletsParticipant').click());
    await page.waitForFunction(() => {
        const walletField = document.querySelector('#wallet');
        return walletField && !walletField.disabled;
    });
    await Utils.selectRandomOption(page, '#wallet');
    await page.type('#external_reference', formData.externalReference);
}

/**
 * Preenche a seção "Identificadores".
 */
async function fillIdentifiers(page, formData) {
    await Utils.expandSectionIfCollapsed(page, '#collapseIdentifiers', 'button[aria-controls="collapseIdentifiers"]');
    await Utils.fillInFields(page, [
        { selector: '#contract_id', value: formData.contractId },
        { selector: '#asset_id', value: formData.assetId },
    ]);
}

/**
 * Preenche a seção "Titular".
 */
async function fillHolderData(page, formData) {
    await Utils.expandSectionIfCollapsed(page, '#collapseHolder', 'button[aria-controls="collapseHolder"]');
    await Utils.fillInFields(page, [
        { selector: '#holder_document_type', value: formData.holderDocumentType, type: 'select' },
        { selector: '#holder_document', value: formData.holderDocument },
        { selector: '#holder_zipcode', value: formData.holderZipcode },
        { selector: '#holder_domicile', value: formData.holderDomicile },
    ]);
}

/**
 * Preenche a seção "Novo Titular".
 */
async function fillNewHolderData(page, formData) {
    await Utils.expandSectionIfCollapsed(page, '#collapseNewHolder', 'button[aria-controls="collapseNewHolder"]');
    await Utils.fillInFields(page, [
        { selector: '#new_holder_document_type', value: formData.newHolderDocumentType, type: 'select' },
        { selector: '#new_holder_document', value: formData.newHolderDocument },
        { selector: '#new_holder_zipcode', value: formData.newHolderZipcode },
        { selector: '#new_holder_domicile', value: formData.newHolderDomicile },
        { selector: '#asset_value_transfer', value: formData.assetValueTransfer },
        { selector: '#asset_date_transfer', value: formData.assetDateTransfer },
    ]);
}

/**
 * Preenche a seção "Fiduciário".
 */
async function fillFiduciaryData(page, formData) {
    await Utils.expandSectionIfCollapsed(page, '#collapseFiduciary', 'button[aria-controls="collapseFiduciary"]');
    await Utils.fillInFields(page, [
        { selector: '#fiduciary_document_type', value: formData.fiduciaryDocumentType, type: 'select' },
        { selector: '#fiduciary_document', value: formData.fiduciaryDocument },
        { selector: '#fiduciary_zipcode', value: formData.fiduciaryZipcode },
        { selector: '#fiduciary_domicile', value: formData.fiduciaryDomicile },
    ]);
}

/**
 * Preenche a seção "Pagador/Devedor".
 */
async function fillPayerDebtorData(page, formData) {
    await Utils.expandSectionIfCollapsed(page, '#collapsePayerDebtor', 'button[aria-controls="collapsePayerDebtor"]');
    await Utils.fillInFields(page, [
        { selector: '#payer_or_debtor_document_type', value: formData.payerDebtorDocumentType, type: 'select' },
        { selector: '#payer_or_debtor_document', value: formData.payerDebtorDocument },
        { selector: '#payer_or_debtor_zipcode', value: formData.payerDebtorZipcode },
        { selector: '#payer_or_debtor_domicile', value: formData.payerDebtorDomicile },
    ]);
}

/**
 * Preenche a seção "Dados dos Ativos".
 */
async function fillAssetData(page, formData) {
    await Utils.expandSectionIfCollapsed(page, '#collapseAssetData', 'button[aria-controls="collapseAssetData"]');
    await Utils.fillInFields(page, [
        { selector: '#issuance_date', value: formData.assetDueDate },
        { selector: '#asset_value', value: formData.assetValue },
        { selector: '#total_contract_value', value: formData.totalContractValue },
        { selector: '#installment_number', value: formData.installmentNumber },
        { selector: '#total_installment_number', value: formData.totalInstallmentNumber },
        { selector: '#asset_due_date', value: formData.assetDueDate },
        { selector: '#uf_payment', value: formData.ufPayment },
        { selector: '#invoice', value: formData.invoice },
    ]);
}

/**
 * Preenche a seção "Outras Informações".
 */
async function fillOtherInformation(page, formData) {
    await Utils.expandSectionIfCollapsed(page, '#collapseOtherInformation', 'button[aria-controls="collapseOtherInformation"]');
    await Utils.fillInFields(page, [
        { selector: '#alternative_information', value: formData.alternativeInformation },
        { selector: '#asset_interest_rate', value: formData.assetInterestRate },
        { selector: '#monetary_correction_index', value: formData.monetaryCorrectionIndex },
        { selector: '#penal_clause', value: formData.penalClause },
        { selector: '#other_charges', value: formData.otherCharges },
        { selector: '#additional_information', value: formData.additionalInformation },
        { selector: '#otr_validation_rule', value: formData.otrValidationRule },
    ]);
}

/**
 * Automatiza o processo de preenchimento e envio do formulário.
 */
export async function create(page, formData) {
    await page.goto(ROUTE.DUPLICATE_SERVICE_CREATE_BASE);

    await fillActionData(page, formData);
    await fillIdentifiers(page, formData);
    await fillHolderData(page, formData);
    await fillNewHolderData(page, formData);
    await fillFiduciaryData(page, formData);
    await fillPayerDebtorData(page, formData);
    await fillAssetData(page, formData);
    await fillOtherInformation(page, formData);

    await page.waitForSelector('button[type="submit"]', { visible: true });
    await page.click('button[type="submit"]');

    const successMessage = await Utils.getToastrMessage(page);
    const protocolData = await Utils.getProtocol(page);

    return { successMessage, protocolData };
}

export async function create2(page, formData) {
    await page.goto(ROUTE.DUPLICATE_SERVICE_CREATE_BASE);

    // Fill "Dados da Ação" section
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
    });
    await page.select('#wallet', formData.wallet);
    await page.type('#external_reference', formData.externalReference);

    // Fill "Identificadores" section
    await Utils.expandSectionIfCollapsed(page, '#collapseIdentifiers', 'button[aria-controls="collapseIdentifiers"]');
    await page.type('#contract_id', formData.contractId);
    await page.type('#asset_id', formData.assetId);

    // Fill "Titular" section
    await Utils.expandSectionIfCollapsed(page, '#collapseHolder', 'button[aria-controls="collapseHolder"]');
    await page.select('#holder_document_type', formData.holderDocumentType);
    await page.type('#holder_document', formData.holderDocument);
    await page.type('#holder_zipcode', formData.holderZipcode);
    await page.type('#holder_domicile', formData.holderDomicile);

    // Fill "Novo Titular" section
    await Utils.expandSectionIfCollapsed(page, '#collapseNewHolder', 'button[aria-controls="collapseNewHolder"]');
    await page.select('#new_holder_document_type', formData.newHolderDocumentType);
    await page.type('#new_holder_document', formData.newHolderDocument);
    await page.type('#new_holder_zipcode', formData.newHolderZipcode);
    await page.type('#new_holder_domicile', formData.newHolderDomicile);
    await page.type('#asset_value_transfer', formData.assetValueTransfer);
    await page.type('#asset_date_transfer', formData.assetDateTransfer);

     // Fill "Fundiciario" section
    await Utils.expandSectionIfCollapsed(page, '#collapseFiduciary', 'button[aria-controls="collapseFiduciary"]');
    await page.waitForSelector('#fiduciary_document_type', { visible: true });
    await page.select('#fiduciary_document_type', formData.fiduciaryDocumentType);
    await page.type('#fiduciary_document', formData.fiduciaryDocument);
    await page.type('#fiduciary_zipcode', formData.fiduciaryZipcode);
    await page.type('#fiduciary_domicile', formData.fiduciaryDomicile);

    /* PAGADOR/DEVEDOR */
     // Fill "pagador/devedor" section
    await Utils.expandSectionIfCollapsed(page, '#collapsePayerDebtor', 'button[aria-controls="collapsePayerDebtor"]');
    await page.waitForSelector('#payer_or_debtor_document_type', { visible: true });
    await page.select('#payer_or_debtor_document_type', formData.payerDebtorDocumentType);
    await page.type('#payer_or_debtor_document', formData.payerDebtorDocument);
    await page.type('#payer_or_debtor_zipcode', formData.payerDebtorZipcode);
    await page.type('#payer_or_debtor_domicile', formData.payerDebtorDomicile);

     // Fill "Dados dos Ativos" section
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

     // Fill "Outras Informações" section
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
    await page.click('button[type="submit"]');

    const successMessage = await Utils.getToastrMessage(page);
    const protocolData = await Utils.getProtocol(page);

    return { successMessage, protocolData };
}
