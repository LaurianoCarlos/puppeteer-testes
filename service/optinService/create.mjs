import { ROUTE } from '../../config/constant.mjs';
import { Utils } from '../../helpers/Utils.js';

async function fillOptinInformation(page, formData) {
    const fields = [
        { selector: '#external_reference', value: formData.external_reference },
        { selector: '#wallet', value: formData.wallet, type: 'select' },
        { selector: '#receiver_document', value: formData.receiver_document },
        { selector: '#start_date_optin', value: formData.start_date_optin },
        { selector: '#final_date_optin', value: formData.final_date_optin },
    ];

    await Utils.fillInFields(page, fields);
}

async function fillURInformation(page, formData) {
    await page.waitForSelector('#headingURInfo', { visible: true });
    await page.evaluate(() => {
        const button = document.querySelector('button[data-bs-target="#collapseURInfo"]');
        if (button) {
            button.click();
        } else {
            throw new Error('Botão não encontrado!');
        }
    });

    const urFields = [
        { selector: '#receivable_receiving_end_users', value: formData.receivable.receiving_end_users },
        { selector: '#receivable_holder_document', value: formData.receivable.holder_document },
        { selector: '#receivable_arrangements', value: formData.receivable.arrangements, type: 'select' },
        { selector: '#receivable_accreditors', value: formData.receivable.accreditors, type: 'select' },
        { selector: '#receivable_start_due_date', value: formData.receivable.start_due_date },
        { selector: '#receivable_final_due_date', value: formData.receivable.final_due_date },
    ];

    await Utils.fillInFields(page, urFields);
}

export async function create(page, formData) {
    await page.goto(ROUTE.OPTIN_CREATE_BASE);

    await fillOptinInformation(page, formData);

    if (formData.receivable) {
        await fillURInformation(page, formData);
    }

    await Promise.all([
        page.evaluate(() => {
            document.querySelector('button[type="submit"]').click();
        }),
    ]);

    const successMessage = await Utils.getToastrMessage(page);
    const protocolData = await Utils.getProtocol(page);

    return { successMessage, protocolData };
}
