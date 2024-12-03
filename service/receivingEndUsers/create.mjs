import { ROUTE } from '../../config/constant.mjs';
import { Utils } from '../../helpers/Utils.js';

export async function forceWait(milliseconds = 5000) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function fillReceivingEndUser(page, formData) {
    const fields = [
        { selector: '#document_type', value: formData.document_type, type: 'select' },
        { selector: '#document_number', value: formData.document_number },
        { selector: '#accreditor_document_number', value: formData.accreditor_document_number, type: 'select' }
    ];

    await Utils.fillInFields(page, fields);
}

async function fillAccount(page, formData) {

    await page.evaluate(() => {
        document.querySelector('#account').scrollIntoView();
    });
  
    await page.evaluate(() => {
        document.querySelector('#buttonAccount').click();
    });

    await page.waitForSelector('#collapseAccount.show', { visible: true });
    
    const fields = [
        { selector: '#account_type', value: formData.type, type: 'select' },
        { selector: '#number', value: formData.number },
        { selector: '#digit', value: formData.digit },
        { selector: '#agency', value: formData.agency },
        { selector: '#form\\.account\\.document_type', value: formData.document_type, type: 'select' },
        { selector: '#account_document_number', value: formData.document_number },
        { selector: '#ispb', value: formData.ispb },
        { selector: '#ispb', value: formData.ispb }
    ];

    await Utils.fillInFields(page, fields);
}

async function fillArrangements(page, formData) { 
    await forceWait();
    await page.evaluate(() => {
        document.querySelector('#accreditor_document_number').scrollIntoView();
    });

    await page.waitForSelector('#arrangements', { visible: true });
    await page.select('#arrangements', formData.arrangements );
    await page.waitForFunction(() => {
        const loadingElement = document.querySelector('#loading');
        return loadingElement && loadingElement.style.display !== 'none';
    });

    await page.waitForFunction(() => {
        const loadingElement = document.querySelector('#loading');
        return loadingElement && loadingElement.style.display === 'none';
    });
}


/**
 * Automates the process of filling out and submitting the Receiving End User form.
 * @param {object} page - Puppeteer page instance.
 * @param {object} formData - The form data to be filled.
 * @returns {object} An object containing the success message and protocol data.
 */
export async function create(page, formData) {
    await page.goto(ROUTE.RECEIVING_END_USER_CREATE_BASE);

    await fillReceivingEndUser(page, formData);
    await fillArrangements(page, formData);
    await fillAccount(page, formData);

    await page.waitForSelector('#submitButton', { visible: true });
    await page.click('#submitButton');

    const successMessage = await Utils.getToastrMessage(page);
    const protocolData = await Utils.getProtocol(page);

    return { successMessage, protocolData };
}
