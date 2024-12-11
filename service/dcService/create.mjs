import { ROUTE } from '../../config/constant.mjs';
import { Utils } from '../../helpers/Utils.js';

async function fillDc(page, formData) {
   
    const fields = [
        { selector: '#holder_document_number', value: formData.holder_document_number },
        { selector: '#wallet', value: formData.wallet, type: 'select' },
        { selector: '#credit_operation_contract_code', value: formData.credit_operation_contract_code },
        { selector: '#transaction_date', value: formData.transaction_date },
        { selector: '#total_credit_amount', value: formData.total_credit_amount },
        { selector: '#interest_rate', value: formData.interest_rate },
        { selector: '#number_contracted_installments', value: formData.number_contracted_installments },
        { selector: '#external_reference', value: formData.external_reference },
        { selector: '#conciliation_id', value: formData.conciliation_id },
        { selector: '#protocol', value: formData.protocol },
        { selector: '#financial_asset_type', value: formData.financial_asset_type, type: 'select' },
        { selector: '#contract_due_date', value: formData.contract_due_date },
        { selector: '#contract_object', value: formData.contract_object },
        { selector: '#floating', value: formData.floating },
        { selector: '#initial_consideration', value: formData.initial_consideration },
        { selector: '#amount_consideration', value: formData.amount_consideration },
        { selector: '#periodicity', value: formData.periodicity },
        { selector: '#first_payment_due', value: formData.first_payment_due },
        { selector: '#expected_guaranteed_residual_value', value: formData.expected_guaranteed_residual_value },
        { selector: '#promissory_note_value', value: formData.promissory_note_value },
        { selector: '#prize_value', value: formData.prize_value },
        { selector: '#original_process', value: formData.original_process },
        { selector: '#data_base_correction', value: formData.data_base_correction },
        { selector: '#precatory', value: formData.precatory },
        { selector: '#precatory_type', value: formData.precatory_type },
        { selector: '#registration_number', value: formData.registration_number },
        { selector: '#lease_term', value: formData.lease_term },
        { selector: '#execution_process', value: formData.execution_process },
        { selector: '#cm7_code', value: formData.cm7_code },
        { selector: '#indexing', value: formData.indexing, type: 'select' },
        { selector: '#note', value: formData.note },
        { selector: '#status_dc', value: formData.status, type: 'select' },
    ];

    await Utils.fillInFields(page, fields);
}

async function fillDebtor(page, formData) {
    await Utils.forcedClick(page, 'button[data-bs-target="#collapseDebtorInfo"]');

    const fields = [
        { selector: '#debtor_document_type', value: formData.debtor.document_type, type: 'select' },
        { selector: '#debtor_document_number', value: formData.debtor.document_number },
        { selector: '#debtor\\.company_name', value: formData.debtor.company_name },
        { selector: '#debtor\\.phone', value: formData.debtor.phone },
        { selector: '#debtor\\.email', value: formData.debtor.email },
        { selector: '#debtor\\.zipcode', value: formData.debtor.zipcode },
        { selector: '#debtor\\.address', value: formData.debtor.address },
    ];

    await Utils.fillInFields(page, fields);
}

async function fillOriginalCreditor(page, formData) {

    await Utils.forcedClick(page, 'button[data-bs-target="#collapseOriginalCreditorInfo"]');

    const fields = [
        { selector: '#original_creditor_document_type', value: formData.original_creditor.document_type, type: 'select' },
        { selector: '#original_creditor_document_number', value: formData.original_creditor.document_number },
        { selector: '#original_creditor\\.company_name', value: formData.original_creditor.company_name },
        { selector: '#original_creditor\\.zipcode', value: formData.original_creditor.zipcode },
        { selector: '#original_creditor\\.address', value: formData.original_creditor.address },
    ];

    await Utils.fillInFields(page, fields);
}

async function fillOperation(page, formData) {

    await Utils.forcedClick(page, 'button[data-bs-target="#collapseOperationInfo"]');

    const fields = [
        { selector: '#operation_type', value: formData.operation.type, type: 'select' },
        { selector: '#operation\\.date', value: formData.operation.date, type: 'date' },
        { selector: '#operation\\.due_date', value: formData.operation.due_date, type: 'date' },
        { selector: '#operation\\.code', value: formData.operation.code },
        { selector: '#operation\\.total_amount', value: formData.operation.total_amount },
    ];

    await Utils.fillInFields(page, fields);
}

async function fillCreditors(page, formData) {
   
    await Utils.forcedClick(page, 'button[data-bs-target="#collapseCreditorsInfo"]');

    for (let i = 0; i < formData.creditors.length; i++) {
        const creditor = formData.creditors[i];

        const fields = [
            { selector: `#creditors_document_type_${i}`, value: creditor.document_type, type: 'select' },
            { selector: `#creditors_document_number_${i}`, value: creditor.document_number },
            { selector: `#creditors_phone_${i}`, value: creditor.phone },
            { selector: `#creditors_email_${i}`, value: creditor.email },
            { selector: `#creditors_zipcode_${i}`, value: creditor.zipcode },
            { selector: `#creditors_address_${i}`, value: creditor.address },
        ];


        await Utils.fillInFields(page, fields);

        if (creditor.is_active) {
            const isChecked = await page.$eval(`#creditors_is_active_${i}`, el => el.checked);
            if (!isChecked) {
                await page.click(`#creditors_is_active_${i}`);
            }
        } else {
            const isChecked = await page.$eval(`#creditors_is_active_${i}`, el => el.checked);
            if (isChecked) {
                await page.click(`#creditors_is_active_${i}`);
            }
        }
    }
}

async function fillInstallments(page, formData) {
    
    await Utils.forcedClick(page, 'button[data-bs-target="#collapseInstallmentsInfo"]');

    for (let i = 0; i < formData.installments.length; i++) {
        const installment = formData.installments[i];

        const fields = [
            { selector: `#installments_status_${i}`, value: installment.status, type: 'select' },
            { selector: `#installments_control_code_${i}`, value: installment.control_code },
            { selector: `#installments_due_date_${i}`, value: installment.due_date, type: 'date' },
            { selector: `#installments_value_${i}`, value: installment.value },
            { selector: `#installments_main_value_${i}`, value: installment.main_value },
            { selector: `#installments_number_${i}`, value: installment.number },
        ];

        await Utils.fillInFields(page, fields);
    }
}

async function fillGuarantors(page, formData) {
  
    await Utils.forcedClick(page, 'button[data-bs-target="#collapseGuarantorsInfo"]');

    for (let i = 0; i < formData.guarantors.length; i++) {
        const guarantor = formData.guarantors[i];

        const fields = [
            { selector: `#guarantors_document_type_${i}`, value: guarantor.document_type, type: 'select' },
            { selector: `#guarantors_document_number_${i}`, value: guarantor.document_number },
            { selector: `#guarantors_name_${i}`, value: guarantor.name },
        ];

        await Utils.fillInFields(page, fields);
    }
}

async function fillPayments(page, formData) {
   
    await Utils.forcedClick(page, 'button[data-bs-target="#collapsePaymentsInfo"]');

    for (let i = 0; i < formData.payments.length; i++) {
        const payment = formData.payments[i];

        const fields = [
            { selector: `#payments_type_${i}`, value: payment.type },
            { selector: `#payments_value_${i}`, value: payment.value },
        ];

        await Utils.fillInFields(page, fields);
    }
}

async function fillAccount(page, formData) {
  
    await Utils.forcedClick(page, 'button[data-bs-target="#collapseAccountInfo"]');

    const fields = [
        { selector: '#account\\.bank', value: formData.account.bank },
        { selector: '#account\\.agency', value: formData.account.agency },
        { selector: '#account\\.number', value: formData.account.number },
        { selector: '#account_type', value: formData.account.type, type: 'select' },
    ];

    await Utils.fillInFields(page, fields);
}

async function fillProperty(page, formData) {
    await Utils.forcedClick(page, 'button[data-bs-target="#collapsePropertyInfo"]');

    const fields = [
        { selector: '#property_state', value: formData.property.state, type: 'select' },
        { selector: '#property\\.city', value: formData.property.city },
        { selector: '#property\\.zipcode', value: formData.property.zipcode },
        { selector: '#property\\.address', value: formData.property.address },
    ];

    await Utils.fillInFields(page, fields);
}

async function fillRecipient(page, formData) {
   
    await Utils.forcedClick(page, 'button[data-bs-target="#collapseRecipientInfo"]');

    const fields = [
        { selector: '#recipient_document_type', value: formData.recipient.document_type, type: 'select' },
        { selector: '#recipient_document_number', value: formData.recipient.document_number },
        { selector: '#recipient\\.name', value: formData.recipient.name },
    ];

    await Utils.fillInFields(page, fields);
}

async function fillOriginalDebtor(page, formData) {
    
    await Utils.forcedClick(page, 'button[data-bs-target="#collapseOriginalDebtorInfo"]');

    const fields = [
        { selector: '#original_debtor_document_type', value: formData.original_debtor.document_type, type: 'select' },
        { selector: '#original_debtor_document_number', value: formData.original_debtor.document_number },
        { selector: '#original_debtor\\.company_name', value: formData.original_debtor.company_name },
    ];

    await Utils.fillInFields(page, fields);
}

async function fillFines(page, formData) {
  
    await Utils.forcedClick(page, 'button[data-bs-target="#collapseFinesInfo"]');

    for (let i = 0; i < formData.fines.length; i++) {
        const fine = formData.fines[i];

        const fineFields = [
            { selector: `#fines_value_${i}`, value: fine.value },
            { selector: `#fines_description_${i}`, value: fine.description },
        ];

        await Utils.fillInFields(page, fineFields);
    }
}

async function fillAdditives(page, formData) {
  
    await Utils.forcedClick(page, 'button[data-bs-target="#collapseAdditivesInfo"]');

    for (let i = 0; i < formData.additives.length; i++) {
        const additive = formData.additives[i];

        const additiveFields = [
            { selector: `#additives_document_type_${i}`, value: additive.document_type, type: 'select' },
            { selector: `#additives_document_number_${i}`, value: additive.document_number },
            { selector: `#additives_company_name_${i}`, value: additive.company_name },
            { selector: `#additives_date_${i}`, value: additive.date, type: 'date' },
            { selector: `#additives_contract_${i}`, value: additive.contract },
        ];

        await Utils.fillInFields(page, additiveFields);
    }
}

async function fillAssignor(page, formData) {
   
    await Utils.forcedClick(page, 'button[data-bs-target="#collapseAssignorInfo"]');

    const assignorFields = [
        { selector: '#assignor_document_type', value: formData.assignor.document_type, type: 'select' },
        { selector: '#assignor_document_number', value: formData.assignor.document_number },
        { selector: '#assignor\\.name', value: formData.assignor.name },
    ];

    await Utils.fillInFields(page, assignorFields);
}


export async function create(page, formData) {
    await page.goto(ROUTE.DC_CREATE_BASE);

    await fillDc(page, formData);
    await fillDebtor(page, formData);
    await fillOriginalCreditor(page, formData);
    await fillOperation(page, formData);
    await fillCreditors(page, formData);
    await fillInstallments(page, formData);
    await fillGuarantors(page, formData);
    await fillPayments(page, formData);
    await fillAccount(page, formData);
    await fillProperty(page, formData);
    await fillRecipient(page, formData);
    await fillOriginalDebtor(page, formData);
    await fillFines(page, formData);
    await fillAdditives(page, formData);
    await fillAssignor(page, formData);

    await Promise.all([
        page.evaluate(() => {
            document.querySelector('button[type="submit"]').click();
        }),
    ]);

    const successMessage = await Utils.getToastrMessage(page);
    const protocolData = await Utils.getProtocol(page);

    return { successMessage, protocolData };
}
