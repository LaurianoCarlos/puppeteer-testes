import { ROUTE } from '../../config/constant.mjs';
import { Utils } from '../../helpers/Utils.js';


async function fillConciliationForm(page, formData) {
    const fields = [
        { selector: '#reference_date', value: formData.reference_date },
        { selector: '#participant_cnpj', value: formData.participant_cnpj },
        { selector: '#holder_cnpj', value: formData.holder_cnpj },
        { selector: '#effect_type', value: formData.effect_type, type: 'select' },
        { selector: '#operation_modality', value: formData.operation_modality, type: 'select' },
        { selector: '#quantity_contracts', value: formData.quantity_contracts },
        { selector: '#quantity_contractors', value: formData.quantity_contractors },
        { selector: '#total_debt_balance', value: formData.total_debt_balance },
        { selector: '#wallet', value: formData.wallet, type: 'select' },
    ];

    await Utils.fillInFields(page, fields);
}

export async function create(page, formData) {
    await page.goto(ROUTE.CONCILIATION_CREATE_BASE);
    await fillConciliationForm(page, formData);

    await page.evaluate(() => {
        document.querySelector('button[type="submit"]').click();
    });
    
    const successMessage = await Utils.getToastrMessage(page);
    const protocolData = await Utils.getProtocol(page);

    return { successMessage, protocolData };
}
