import { ROUTE } from '../../config/constant.mjs';
import { Utils } from '../../helpers/Utils.js';

async function fillContractEffect(page, formData) {
    const fields = [
        { selector: '#external_reference', value: formData.external_reference },
        { selector: '#contract_reference', value: formData.contract_reference },
        { selector: '#receiving_end_user_document_number', value: formData.receiving_end_user_document_number },
        { selector: '#is_renegotiation', value: formData.is_renegotiation, type: 'select' },
        { selector: '#previous_contract_reference', value: formData.previous_contract_reference },
        { selector: '#participant_document_number', value: formData.participant_document_number },
        { selector: '#holder_document_number', value: formData.holder_document_number },
        { selector: '#effect_type', value: formData.effect_type, type: 'select' },
        { selector: '#outstanding_balance', value: formData.outstanding_balance },
        { selector: '#warranty_operation_limit', value: formData.warranty_operation_limit },
        { selector: '#minimum_value_maintained', value: formData.minimum_value_maintained },
        { selector: '#due_date', value: formData.due_date },
        { selector: '#signature_date', value: formData.signature_date },
        { selector: '#manager_reference', value: formData.manager_reference },
        { selector: '#operation_modality', value: formData.operation_modality, type: 'select' },
        { selector: '#wallet', value: formData.wallet, type: 'select' },
        { selector: '#interest_rate', value: formData.interest_rate },
    ];

    await Utils.fillInFields(page, fields);
}

async function fillPayment(page, formData) {
    await Utils.expandSectionIfCollapsed(page, '#collapsePaymentInfo', 'button[aria-controls="collapsePaymentInfo"]');

    const paymentFields = [
        { selector: '#installment_date', value: formData.installments.installment_date },
        { selector: '#installment_value', value: formData.installments.installment_value },
    ];
    await Utils.fillInFields(page, paymentFields);
}

async function fillWarranties(page, formData) {
    await Utils.expandSectionIfCollapsed(page, '#collapseWarrantiesInfo', 'button[data-bs-target="#collapseWarrantiesInfo"]');
    const warranty = [
        { selector: '#warranties_external_reference', value: formData.warranties.external_reference },
        { selector: '#warranties_division_rule', value: formData.warranties.division_rule },
    ];

    await Utils.fillInFields(page, warranty);

    await Utils.expandSectionIfCollapsed(page, '#collapsePaymentAccountInfo', 'button[data-bs-target="#collapsePaymentAccountInfo"]');

    const warrantyFields = [
        { selector: '#warranties_external_reference', value: formData.warranties.external_reference },
        { selector: '#warranties_division_rule', value: formData.warranties.division_rule },
        { selector: '#warranties_charged_value', value: formData.warranties.charged_value },
        { selector: '#payment_account_document_number', value: formData.warranties.payment_account.document_number },
        { selector: '#payment_account_holder_name', value: formData.warranties.payment_account.holder_name },
        { selector: '#payment_account_account_type', value: formData.warranties.payment_account.account_type, type: 'select' },
        { selector: '#payment_account_ispb', value: formData.warranties.payment_account.ispb },
        { selector: '#payment_account_agency', value: formData.warranties.payment_account.agency },
        { selector: '#payment_account_account_number', value: formData.warranties.payment_account.account_number },
        { selector: '#payment_account_comp', value: formData.warranties.payment_account.comp },
    ];
    await Utils.fillInFields(page, warrantyFields);


    if (formData.warranties.receivables) {
        await Utils.expandSectionIfCollapsed(page, '#collapseURInfo', 'button[data-bs-target="#collapseURInfo"]');
        const urFields = [
            { selector: '#receivables_accreditor_document_number', value: formData.warranties.receivables.accreditor_document_number },
            { selector: '#receivables_receiving_end_user_document_number', value: formData.warranties.receivables.receiving_end_user_document_number },
            { selector: '#receivables_holder_document_number', value: formData.warranties.receivables.holder_document_number },
            { selector: '#receivables_arrangements', value: formData.warranties.receivables.arrangements, type: 'select' },
            { selector: '#receivables_start_date', value: formData.warranties.receivables.start_date },
            { selector: '#receivables_end_date', value: formData.warranties.receivables.end_date },
        ];
        await Utils.fillInFields(page, urFields);
    }
}

export async function create(page, formData) {
    await page.goto(ROUTE.CONTRACT_EFFECTS_CREATE_BASE);
    await fillContractEffect(page, formData);
    await fillPayment(page, formData);
    await fillWarranties(page, formData);

    await page.evaluate(() => {
        document.querySelector('button[type="submit"]').click();
    });

    const successMessage = await Utils.getToastrMessage(page);
    const protocolData = await Utils.getProtocol(page);

    return { successMessage, protocolData };
}
