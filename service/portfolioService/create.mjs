import { ROUTE } from '../../config/constant.mjs';
import { Utils } from '../../helpers/Utils.js';

async function fillPortfolio(page, formData) {
   
    const fields = [
        { selector: '#reference', value: formData.reference },
        { selector: '#description', value: formData.description },
        { selector: '#total_amount', value: formData.total_amount },
    ];

    await Utils.fillInFields(page, fields);
}

async function fillItems(page, formData) {
    await Utils.forcedClick(page, 'button[data-bs-target="#collapseItemInfo"]');

    for (let i = 0; i < formData.items.length; i++) {
        const item = formData.items[i];

        const itemFields = [
            { selector: `#items_document_number_${i}`, value: item.document_number },
            { selector: `#items_asset_uuid_${i}`, value: item.asset_uuid },
            { selector: `#items_description_${i}`, value: item.description },
            { selector: `#items_value_${i}`, value: item.value },
            { selector: `#items_due_date_${i}`, value: item.due_date, type: 'date' },
            { selector: `#items_original_register_date_${i}`, value: item.original_register_date, type: 'date' },
            { selector: `#items_company_name_${i}`, value: item.company_name },
        ];

        await Utils.fillInFields(page, itemFields);

    }
}

export async function create(page, formData) {
    await page.goto(ROUTE.CDCA_PORTFOLIO_CREATE_BASE);

    await fillPortfolio(page, formData);
    await fillItems(page, formData);

    await Promise.all([
        page.evaluate(() => {
            document.querySelector('button[type="submit"]').click();
        }),
    ]);

    const successMessage = await Utils.getToastrMessage(page);
    const protocolData = await Utils.getProtocol(page);

    return { successMessage, protocolData };
}
