import { DUPLICATE_MERCANTIL_CREATE_BASE } from '../../config/constant.mjs';
import { expandSectionIfCollapsed } from '../../helpers/helpers.js';

/**
 * Automates the process of filling out and submitting the Duplicate Service form.
 * @param {object} page - Puppeteer page instance.
 * @param {object} formData - The form data to be filled.
 * @returns {object} An object containing the success message and protocol data.
 */
export async function createDuplicateService(page, formData) {
    await page.goto(DUPLICATE_MERCANTIL_CREATE_BASE);

    // Fill "Dados da Ação" section
    await page.waitForSelector('#collapseActionData', { visible: true });
    await page.select('#occurrence', formData.occurrence);
    await page.type('#main_participant_cnpj', formData.mainParticipantCnpj);
    await page.click('#searchWalletsParticipant');
    await page.waitForSelector('#wallet:not([disabled])');
    await page.select('#wallet', formData.wallet);
    await page.type('#external_reference', formData.externalReference);

    // Fill "Identificadores" section
    await expandSectionIfCollapsed(page, '#collapseIdentifiers', 'button[aria-controls="collapseIdentifiers"]');
    await page.type('#contract_id', formData.contractId);
    await page.type('#asset_id', formData.assetId);

    // Fill "Titular" section
    await expandSectionIfCollapsed(page, '#collapseHolder', 'button[aria-controls="collapseHolder"]');
    await page.select('#holder_document_type', formData.holderDocumentType);
    await page.type('#holder_document', formData.holderDocument);
    await page.type('#holder_zipcode', formData.holderZipcode);
    await page.type('#holder_domicile', formData.holderDomicile);

    // Fill "Novo Titular" section
    await expandSectionIfCollapsed(page, '#collapseNewHolder', 'button[aria-controls="collapseNewHolder"]');
    await page.select('#new_holder_document_type', formData.newHolderDocumentType);
    await page.type('#new_holder_document', formData.newHolderDocument);
    await page.type('#new_holder_zipcode', formData.newHolderZipcode);
    await page.type('#new_holder_domicile', formData.newHolderDomicile);
    await page.type('#asset_value_transfer', formData.assetValueTransfer);
    await page.type('#asset_date_transfer', formData.assetDateTransfer);

    // Submit the form
    await page.waitForSelector('button[type="submit"]', { visible: true });
    await page.click('button[type="submit"]');

    await page.waitForSelector('.toast-success', { visible: true });

    const successMessage = await page.evaluate(() => {
        const toast = document.querySelector('.toast-success');
        return toast ? toast.innerText : null;
    });

  
    const protocolData = await page.evaluate(() => {
        return {
            id: document.querySelector('#protocolId').innerText,
            status: document.querySelector('#protocolStatus').innerText,
        };
    });

    return { successMessage, protocolData };
}
