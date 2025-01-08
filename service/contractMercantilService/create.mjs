import { ROUTE } from '../../config/constant.mjs';
import { Utils } from '../../helpers/Utils.js';

/**
 * Preenche a seção "Dados da Ação".
 * @param {object} page - Instância do Puppeteer.
 * @param {object} formData - Dados do formulário.
 */
async function fillActionData(page, formData) {
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
    await Utils.selectRandomOption(page, '#wallet');
    await page.type('#external_reference', formData.externalReference);
}

/**
 * Preenche a seção "Identificadores".
 * @param {object} page - Instância do Puppeteer.
 * @param {object} formData - Dados do formulário.
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
 * @param {object} page - Instância do Puppeteer.
 * @param {object} formData - Dados do formulário.
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
 * @param {object} page - Instância do Puppeteer.
 * @param {object} formData - Dados do formulário.
 */
async function fillNewHolderData(page, formData) {
    await Utils.expandSectionIfCollapsed(page, '#collapseNewHolder', 'button[aria-controls="collapseNewHolder"]');
    await Utils.fillInFields(page, [
        { selector: '#new_holder_document_type', value: formData.newHolderDocumentType, type: 'select' },
        { selector: '#new_holder_document', value: formData.newHolderDocument },
        { selector: '#new_holder_zipcode', value: formData.newHolderZipcode },
        { selector: '#new_holder_domicile', value: formData.newHolderDomicile },
        { selector: '#asset_value_transfer', value: formData.assetValueTransfer },
        { selector: '#asset_date_transfer', value: formData.issuanceDate },
    ]);
}

/**
 * Preenche a seção "Fiduciário".
 * @param {object} page - Instância do Puppeteer.
 * @param {object} formData - Dados do formulário.
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
 * @param {object} page - Instância do Puppeteer.
 * @param {object} formData - Dados do formulário.
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
 * @param {object} page - Instância do Puppeteer.
 * @param {object} formData - Dados do formulário.
 */
async function fillAssetData(page, formData) {
    await Utils.expandSectionIfCollapsed(page, '#collapseAssetData', 'button[aria-controls="collapseAssetData"]');
    await Utils.fillInFields(page, [
        { selector: '#issuance_date', value: formData.issuanceDate },
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
 * @param {object} page - Instância do Puppeteer.
 * @param {object} formData - Dados do formulário.
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
 * Automatiza o processo de preenchimento e envio do formulário de Duplicata Mercantil.
 * @param {object} page - Instância do Puppeteer.
 * @param {object} formData - Dados do formulário a serem preenchidos.
 * @returns {object} Um objeto contendo a mensagem de sucesso e os dados do protocolo.
 */
export async function create(page, formData) {
    await page.goto(ROUTE.CONTRACT_MERCANTIL_CREATE_BASE);

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
    await page.waitForSelector('.toast-success', { visible: true });

    const successMessage = await Utils.getToastrMessage(page);
    const protocolData = await Utils.getProtocol(page);

    return { successMessage, protocolData };
}


