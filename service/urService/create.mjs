import { ROUTE } from '../../config/constant.mjs';
import { Utils } from '../../helpers/Utils.js';

export async function fillReceivableAndUser(page, formData) { 
    const fields = [
        { selector: '#accreditor_document_number', value: formData.accreditor_document_number, type: 'select' },
        { selector: '#document_type', value: formData.document_type, type: 'select' },
    ];
    await Utils.fillInFields(page, fields);


    await page.evaluate((cnpjValue) => {
        const cnpjField = document.querySelector('#document_number');
        cnpjField.value = cnpjValue;
        cnpjField.dispatchEvent(new Event('input', { bubbles: true }));
    }, formData.document_number);

    await page.waitForSelector('button[type="button"][wire\\:click="searchDocument"]', { visible: true });
    await page.evaluate(() => document.querySelector('button[type="button"][wire\\:click="searchDocument"]').click());
    await page.waitForFunction(() => {
        const button = document.querySelector('button[type="button"][wire\\:click="searchDocument"]');
        return button && !button.disabled;
    });
}

export async function fillUr(page, formData) {

    const fields = [
        { selector: '#occurrence', value: formData.occurrence, type: 'select' },
        { selector: '#external_reference', value: formData.external_reference },
        { selector: '#account_document_number_ur', value: formData.account_document_number_ur },
        { selector: '#value', value: formData.value },
        { selector: '#pre_paid_value', value: formData.pre_paid_value },
        { selector: '#due_date', value: formData.due_date },
        { selector: '#arrangement', value: formData.arrangement, type: 'select' }
    ];

    await Utils.fillInFields(page, fields);
}

/**
 * Automates the process of filling out and submitting the Duplicate Service form.
 * @param {object} page - Puppeteer page instance.
 * @param {object} formData - The form data to be filled.
 * @returns {object} An object containing the success message and protocol data.
 */
export async function create(page, formData) {
    await page.goto(ROUTE.UR_CREATE_BASE);

    await fillReceivableAndUser(page, formData);
    await fillUr(page, formData);
    

    await Promise.all([
        page.evaluate(() => {
            document.querySelector('button[type="submit"]').click();
        }),
    ]);

    const successMessage = await Utils.getToastrMessage(page);
    const protocolData = await Utils.getProtocol(page);

    return { successMessage, protocolData };
}
