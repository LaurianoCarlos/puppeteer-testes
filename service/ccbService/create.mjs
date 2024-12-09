import { ROUTE } from '../../config/constant.mjs';
import { Utils } from '../../helpers/Utils.js';

async function fillCcbInformation(page, formData) {
    
    const fields = [
        { selector: '#holder_document_number', value: formData.holder_document_number },
        { selector: '#wallet', value: formData.wallet, type: 'select'},
        { selector: '#external_reference', value: formData.external_reference },
        { selector: '#registry_agent', value: formData.registry_agent },
        { selector: '#contact_uuid', value: formData.contact_uuid },
        { selector: '#sub_code', value: formData.sub_code },
        { selector: '#credit_operation_modality_code', value: formData.credit_operation_modality_code, type: 'select' },
        { selector: '#transaction_date', value: formData.transaction_date },
        { selector: '#total_credit_amount', value: formData.total_credit_amount },
        { selector: '#net_credit_value', value: formData.net_credit_value },
        { selector: '#indexing', value: formData.indexing, type: 'select' },
        { selector: '#interest_rate', value: formData.interest_rate },
        { selector: '#number_contracted_installments', value: formData.number_contracted_installments },
        { selector: '#protocol', value: formData.protocol },
    ];

    await Utils.fillInFields(page, fields);
}

async function fillCreditorInformation(page, formData) {

    await Utils.forcedClick(page, 'button[data-bs-target="#collapseCreditorInfo"]');

    const fields = [
        { selector: '#creditors\\.document_number', value: formData.creditors.document_number },
    ];

    
    await Utils.fillInFields(page, fields);
}

async function fillDebtorInformation(page, formData) {
    
    await Utils.forcedClick(page, 'button[data-bs-target="#collapseDebtorInfo"]');
    const fields = [
        { selector: '#debtors\\.document_number', value: formData.debtors.document_number },
        { selector: '#debtors\\.email', value: formData.debtors.email },
        { selector: '#debtors\\.social_name', value: formData.debtors.social_name },
        { selector: '#debtors\\.zipcode', value: formData.debtors.zipcode },
        { selector: '#debtors\\.phone', value: formData.debtors.phone },
    ];

    await Utils.fillInFields(page, fields);
}

async function fillGuarantorInformation(page, formData) {
   
    await Utils.forcedClick(page, 'button[data-bs-target="#collapseGuarantorInfo"]');
   
    const fields = [
        { selector: '#guarantors\\.document_number', value: formData.guarantors.document_number },
        { selector: '#guarantors\\.description', value: formData.guarantors.description },
    ];

    
    await Utils.fillInFields(page, fields);
}

async function fillInstallmentInformation(page, formData) {

    await Utils.forcedClick(page, 'button[data-bs-target="#collapseInstallmentInfo"]');
   
    const fields = [
        { selector: '#installments\\.status', value: formData.installments.status, type: 'select' },
        { selector: '#installments\\.control_code', value: formData.installments.control_code },
        { selector: '#installments\\.due_date', value: formData.installments.due_date },
        { selector: '#installments\\.number', value: formData.installments.number },
        { selector: '#installments\\.value', value: formData.installments.value },
        { selector: '#installments\\.main_value', value: formData.installments.main_value },
    ];

    await Utils.fillInFields(page, fields);
}

async function fillIssuerInformation(page, formData) {

    await Utils.forcedClick(page, 'button[data-bs-target="#collapseIssuerInfo"]');
   
    const fields = [
        { selector: '#issuer\\.document_number', value: formData.issuer.document_number },
        { selector: '#issuer\\.company_name', value: formData.issuer.company_name },
    ];

    await Utils.fillInFields(page, fields);
}

async function fillRecipientInformation(page, formData) {
   
    await Utils.forcedClick(page, 'button[data-bs-target="#collapseRecipientInfo"]');
    
    const fields = [
        { selector: '#recipient\\.document_number', value: formData.recipient.document_number },
        { selector: '#recipient\\.type', value: formData.recipient.type, type: 'select' },
        { selector: '#recipient\\.agency', value: formData.recipient.agency },
        { selector: '#recipient\\.account', value: formData.recipient.account },
    ];

    await Utils.fillInFields(page, fields);
}

async function fillWarrantyInformation(page, formData) {

    await Utils.forcedClick(page, 'button[data-bs-target="#collapseWarrantyInfo"]');
    const fields = [
        { selector: '#warranties\\.type', value: formData.warranties.type, type: 'select'},
        { selector: '#warranties\\.description', value: formData.warranties.description },
        { selector: '#warranties\\.value', value: formData.warranties.value },
        { selector: '#warranties\\.identifier', value: formData.warranties.identifier },
        { selector: '#warranties\\.license_plate', value: formData.warranties.license_plate },
        { selector: '#warranties\\.chassis', value: formData.warranties.chassis },
        { selector: '#warranties\\.model_year', value: formData.warranties.model_year },
        { selector: '#warranties\\.state', value: formData.warranties.state },
        { selector: '#warranties\\.document_reference', value: formData.warranties.document_reference },
        { selector: '#warranties\\.registration_number', value: formData.warranties.registration_number },
        { selector: '#warranties\\.registry_office_identification', value: formData.warranties.registry_office_identification },
        { selector: '#warranties\\.address', value: formData.warranties.address },
        { selector: '#warranties\\.number', value: formData.warranties.number },
        { selector: '#warranties\\.city', value: formData.warranties.city },
        { selector: '#warranties\\.country', value: formData.warranties.country },
        { selector: '#warranties\\.building_type', value: formData.warranties.building_type },
    ];

    await Utils.fillInFields(page, fields);
}


export async function create(page, formData) {
    await page.goto(ROUTE.CCB_CREATE_BASE);

    await fillCcbInformation(page, formData);
    await fillCreditorInformation(page, formData);
    await fillDebtorInformation(page, formData);
    await fillRecipientInformation(page, formData);
    await fillGuarantorInformation(page, formData);
    await fillInstallmentInformation(page, formData);
    await fillIssuerInformation(page, formData);
    await fillWarrantyInformation(page, formData);
    
    await Promise.all([
        page.evaluate(() => {
            document.querySelector('button[type="submit"]').click();
        }),
    ]);

    const successMessage = await Utils.getToastrMessage(page);
    const protocolData = await Utils.getProtocol(page);

    return { successMessage, protocolData };
}
