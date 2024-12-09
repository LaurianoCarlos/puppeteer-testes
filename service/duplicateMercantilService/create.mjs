import { ROUTE, TIME } from '../../config/constant.mjs';
import { Utils } from '../../helpers/Utils.js';


async function selectRandomOption(page, selectSelector) {
    await page.waitForSelector(selectSelector, { visible: true });
    const randomOptionValue = await page.evaluate((selector) => {
        const select = document.querySelector(selector);
        const options = Array.from(select.options);

        const validOptions = options.filter(option => option.value.trim() !== '');
        if (validOptions.length === 0) throw new Error("Nenhuma opção válida disponível.");

        const randomValidIndex = Math.floor(Math.random() * validOptions.length);
        const randomOption = validOptions[randomValidIndex];
        select.value = randomOption.value;
        select.dispatchEvent(new Event('change', { bubbles: true }));

        return randomOption.value;
    }, selectSelector);
    return randomOptionValue;
}


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

    await selectRandomOption(page, '#wallet');
    await page.type('#external_reference', formData.externalReference);
}


async function fillIdentifiers(page, formData) {
    const fields = [
        { selector: '#contract_id', value: formData.contractId },
        { selector: '#asset_id', value: formData.assetId },
    ];

    await Utils.expandSectionIfCollapsed(page, '#collapseIdentifiers', 'button[aria-controls="collapseIdentifiers"]');
    await Utils.fillInFields(page, fields);
}


async function fillHolderData(page, formData) {
    const holderFields = [
        { selector: '#holder_document_type', value: formData.holderDocumentType, type: 'select' },
        { selector: '#holder_document', value: formData.holderDocument },
        { selector: '#holder_zipcode', value: formData.holderZipcode },
        { selector: '#holder_domicile', value: formData.holderDomicile },
    ];

    const newHolderFields = [
        { selector: '#new_holder_document_type', value: formData.newHolderDocumentType, type: 'select' },
        { selector: '#new_holder_document', value: formData.newHolderDocument },
        { selector: '#new_holder_zipcode', value: formData.newHolderZipcode },
        { selector: '#new_holder_domicile', value: formData.newHolderDomicile },
        { selector: '#asset_value_transfer', value: formData.assetValueTransfer },
        { selector: '#asset_date_transfer', value: formData.issuanceDate },
    ];

    await Utils.expandSectionIfCollapsed(page, '#collapseHolder', 'button[aria-controls="collapseHolder"]');
    await Utils.fillInFields(page, holderFields);

    await Utils.expandSectionIfCollapsed(page, '#collapseNewHolder', 'button[aria-controls="collapseNewHolder"]');
    await Utils.fillInFields(page, newHolderFields);
}


async function fillFiduciaryAndPayerData(page, formData) {
    const fiduciaryFields = [
        { selector: '#fiduciary_document_type', value: formData.fiduciaryDocumentType, type: 'select' },
        { selector: '#fiduciary_document', value: formData.fiduciaryDocument },
        { selector: '#fiduciary_zipcode', value: formData.fiduciaryZipcode },
        { selector: '#fiduciary_domicile', value: formData.fiduciaryDomicile },
    ];

    const payerFields = [
        { selector: '#payer_or_debtor_document_type', value: formData.payerDebtorDocumentType, type: 'select' },
        { selector: '#payer_or_debtor_document', value: formData.payerDebtorDocument },
        { selector: '#payer_or_debtor_zipcode', value: formData.payerDebtorZipcode },
        { selector: '#payer_or_debtor_domicile', value: formData.payerDebtorDomicile },
    ];

    await Utils.expandSectionIfCollapsed(page, '#collapseFiduciary', 'button[aria-controls="collapseFiduciary"]');
    await Utils.fillInFields(page, fiduciaryFields);

    await Utils.expandSectionIfCollapsed(page, '#collapsePayerDebtor', 'button[aria-controls="collapsePayerDebtor"]');
    await Utils.fillInFields(page, payerFields);
}


async function fillAssetAndOtherData(page, formData) {
    const assetFields = [
        { selector: '#issuance_date', value: formData.issuanceDate },
        { selector: '#asset_value', value: formData.assetValue },
        { selector: '#total_contract_value', value: formData.totalContractValue },
        { selector: '#installment_number', value: formData.installmentNumber },
        { selector: '#total_installment_number', value: formData.totalInstallmentNumber },
        { selector: '#asset_due_date', value: formData.assetDueDate },
        { selector: '#uf_payment', value: formData.ufPayment },
        { selector: '#invoice', value: formData.invoice },
    ];

    const otherFields = [
        { selector: '#alternative_information', value: formData.alternativeInformation },
        { selector: '#asset_interest_rate', value: formData.assetInterestRate },
        { selector: '#monetary_correction_index', value: formData.monetaryCorrectionIndex },
        { selector: '#penal_clause', value: formData.penalClause },
        { selector: '#other_charges', value: formData.otherCharges },
        { selector: '#additional_information', value: formData.additionalInformation },
        { selector: '#otr_validation_rule', value: formData.otrValidationRule },
    ];

    await Utils.expandSectionIfCollapsed(page, '#collapseAssetData', 'button[aria-controls="collapseAssetData"]');
    await Utils.fillInFields(page, assetFields);

    await Utils.expandSectionIfCollapsed(page, '#collapseOtherInformation', 'button[aria-controls="collapseOtherInformation"]');
    await Utils.fillInFields(page, otherFields);
}


export async function create(page, formData) {
    await page.goto(ROUTE.DUPLICATE_MERCANTIL_CREATE_BASE);

    await fillActionData(page, formData);
    await fillIdentifiers(page, formData);
    await fillHolderData(page, formData);
    await fillFiduciaryAndPayerData(page, formData);
    await fillAssetAndOtherData(page, formData);

    await page.waitForSelector('button[type="submit"]', { visible: true });
    await page.evaluate(() => document.querySelector('button[type="submit"]').click());

    await page.waitForSelector('.toast-success', { visible: true, timeout: TIME.TWO_MINUTES });

    const successMessage = await Utils.getToastrMessage(page);
    const protocolData = await Utils.getProtocol(page);

    return { successMessage, protocolData };
}
