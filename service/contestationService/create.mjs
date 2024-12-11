import { ROUTE } from '../../config/constant.mjs';
import { Utils } from '../../helpers/Utils.js';

async function fillContestationForm(page, formData) {
    const fields = [
        { selector: '#identifier', value: formData.identifier },
        { selector: '#external_reference', value: formData.external_reference },
        { selector: '#receiver_document', value: formData.receiver_document },
        { selector: '#receiving_end_user_document', value: formData.receiving_end_user_document },
        { selector: '#recipient_document', value: formData.recipient_document },
        { selector: '#reason', value: formData.reason, type: 'select' },
        { selector: '#description', value: formData.description },
        { selector: '#type', value: formData.type, type: 'select' },
        { selector: '#operation_id', value: formData.operation_id },
        { selector: '#date', value: formData.date },
        { selector: '#type_contestant', value: formData.type_contestant, type: 'select' },
    ];

    await Utils.fillInFields(page, fields);
}

export async function create(page, formData) {
    await page.goto(ROUTE.CONTESTATION_CREATE_BASE);
  
    await fillContestationForm(page, formData);

    await page.evaluate(() => {
        document.querySelector('button[type="submit"]').click();
    });

    const successMessage = await Utils.getToastrMessage(page);
    const protocolData = await Utils.getProtocol(page);

    return { successMessage, protocolData };
}
