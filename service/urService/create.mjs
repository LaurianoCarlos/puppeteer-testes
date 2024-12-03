import { ROUTE } from '../../config/constant.mjs';
import { Utils } from '../../helpers/Utils.js';


/**
 * Automates the process of filling out and submitting the Duplicate Service form.
 * @param {object} page - Puppeteer page instance.
 * @param {object} formData - The form data to be filled.
 * @returns {object} An object containing the success message and protocol data.
 */
export async function create(page, formData) {
    await page.goto(ROUTE.UR_CREATE_BASE);

    const fields = [
        { selector: '#accreditor_document_number', value: formData.accreditor_document_number, type: 'select' },
        { selector: '#document_type', value: formData.document_type, type: 'select' },
        { selector: '#document_number', value: formData.document_number },
        { selector: '#account_agency', value: formData.account.agency },
        { selector: '#account_number', value: formData.account.number },
        { selector: '#account_digit', value: formData.account.digit },
        { selector: '#account_type', value: formData.account.type },
        { selector: '#account_ispb', value: formData.account.ispb },
        { selector: '#account_document_type', value: formData.account.document_type },
        { selector: '#account_document_number', value: formData.account.document_number },

        { selector: '#occurrence', value: formData.occurrence, type: 'select' },
        { selector: '#external_reference', value: formData.external_reference },
        { selector: '#holder_document_number', value: formData.holder_document_number },
        { selector: '#value', value: formData.value },
        { selector: '#pre_paid_value', value: formData.pre_paid_value },
        { selector: '#due_date', value: formData.due_date },
        { selector: '#arrangement', value: formData.arrangement, type: 'select' }
    ];

    await Utils.fillInFields(page, fields);

    await page.waitForSelector('#submitButton', { visible: true });
    //await page.click('#submitButton');

    const successMessage = await Utils.getToastrMessage(page);
    const protocolData = await Utils.getProtocol(page);

    return { successMessage, protocolData };
}
