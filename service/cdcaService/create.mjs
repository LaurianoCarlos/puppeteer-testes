import { ROUTE } from '../../config/constant.mjs';
import { Utils } from '../../helpers/Utils.js';

async function fillCdca(page, formData) {
   
    const fields = [
        { selector: '#holder_document_number', value: formData.holder_document_number },
        { selector: '#wallet', value: formData.wallet, type: 'select' },
        { selector: '#external_reference', value: formData.external_reference },
        { selector: '#registry_agent', value: formData.registry_agent },
        { selector: '#contact_uuid', value: formData.contact_uuid },
        { selector: '#code_contract_operation_credit', value: formData.code_contract_operation_credit },
        { selector: '#transaction_date', value: formData.transaction_date},
        { selector: '#total_credit_amount', value: formData.total_credit_amount },
        { selector: '#net_credit_value', value: formData.net_credit_value },
        { selector: '#indexing', value: formData.indexing, type: 'select' },
        { selector: '#interest_rate', value: formData.interest_rate },
        { selector: '#number_contracted_installments', value: formData.number_contracted_installments },
        { selector: '#protocol', value: formData.protocol },
        { selector: '#delivery_date', value: formData.delivery_date},
        { selector: '#conciliation_id', value: formData.conciliation_id },
    ];

    await Utils.fillInFields(page, fields);
}

async function fillCreditor(page, formData) {
    await Utils.forcedClick(page, 'button[data-bs-target="#collapseCreditorInfo"]');

    const fields = [
        { selector: '#creditors\\.document_number', value: formData.creditors.document_number },
        { selector: '#creditors\\.liquidation_document_number', value: formData.creditors.liquidation_document_number },
        { selector: '#creditors\\.email', value: formData.creditors.email },
        { selector: '#creditors\\.liquidation_holder_name', value: formData.creditors.liquidation_holder_name },
        { selector: '#creditors\\.liquidation_type', value: formData.creditors.liquidation_type, type: 'select' },
        { selector: '#creditors\\.liquidation_bank', value: formData.creditors.liquidation_bank },
        { selector: '#creditors\\.liquidation_agency', value: formData.creditors.liquidation_agency },
        { selector: '#creditors\\.liquidation_number', value: formData.creditors.liquidation_number },
    ];

    await Utils.fillInFields(page, fields);
}

async function fillDebtorInformation(page, formData) {

    await Utils.forcedClick(page, 'button[data-bs-target="#collapseDebtorInfo"]');

    const fields = [
        { selector: '#debtors\\.document_number', value: formData.debtors.document_number },
        { selector: '#debtors\\.email', value: formData.debtors.email },
        { selector: '#debtors\\.company_name', value: formData.debtors.company_name },
        { selector: '#debtors\\.zipcode', value: formData.debtors.zipcode },
        { selector: '#debtors\\.phone', value: formData.debtors.phone },
    ];

    await Utils.fillInFields(page, fields);
}

async function fillInstallment(page, formData) {
    await Utils.forcedClick(page, 'button[data-bs-target="#collapseInstallmentInfo"]');

    const fields = [
        { selector: '#installments\\.status', value: formData.installments.status, type: 'select' },
        { selector: '#installments\\.control_code', value: formData.installments.control_code },
        { selector: '#installments\\.due_date', value: formData.installments.due_date, type: 'date' },
        { selector: '#installments\\.number', value: formData.installments.number },
        { selector: '#installments\\.value', value: formData.installments.value },
    ];

    await Utils.fillInFields(page, fields);
}

async function fillIssuer(page, formData) {
    await Utils.forcedClick(page, 'button[data-bs-target="#collapseIssuerInfo"]');

    const fields = [
        { selector: '#issuer\\.document_number', value: formData.issuer.document_number },
        { selector: '#issuer\\.company_name', value: formData.issuer.company_name },
    ];

    await Utils.fillInFields(page, fields);
}

async function fillOriginalCreditor(page, formData) {

    await Utils.forcedClick(page, 'button[data-bs-target="#collapseOriginalCreditorInfo"]');

    const fields = [
        { selector: '#original_creditor\\.document_number', value: formData.original_creditor.document_number },
        { selector: '#original_creditor\\.company_name', value: formData.original_creditor.company_name },
    ];

    await Utils.fillInFields(page, fields);
}

async function fillAgent(page, formData) {
    await Utils.forcedClick(page, 'button[data-bs-target="#collapseAgentsInfo"]');

    const fields = [
        { selector: '#agents\\.document_number', value: formData.agents.document_number },
        { selector: '#agents\\.type', value: formData.agents.type, type: 'select' },
        { selector: '#agents\\.email', value: formData.agents.email },
    ];

    await Utils.fillInFields(page, fields);
}

export async function create(page, formData) {
    await page.goto(ROUTE.CDCA_CREATE_BASE);

    await fillCdca(page, formData);
    await fillIssuer(page, formData);
    await fillCreditor(page, formData);
    await fillDebtorInformation(page, formData);
    await fillInstallment(page, formData);
    await fillOriginalCreditor(page, formData);
    await fillAgent(page, formData);

    await Promise.all([
        page.evaluate(() => {
            document.querySelector('button[type="submit"]').click();
        }),
    ]);

    const successMessage = await Utils.getToastrMessage(page);
    const protocolData = await Utils.getProtocol(page);

    return { successMessage, protocolData };
}
