import { BASE_URL } from '../../config/constant.mjs';
import { Utils } from '../../helpers/Utils.js';


export async function addPayment(page, formData, id) {
    const route = `${BASE_URL}duplicate-mercantil/liquidations/${id}/create`
   
    const fields = [
        { selector: '#payment_value', value: formData.assetValue },
        { selector: '#payment_date', value: formData.issuanceDate },
        { selector: '#liquidation_type', value: formData.holderDocumentType, type: 'select' },
    ];


    await page.goto(route);

    await Utils.fillInFields(page, fields);
    
    await page.waitForSelector('button[type="submit"]', { visible: true });
    await page.evaluate(() => document.querySelector('button[type="submit"]').click());


    await page.waitForSelector('.toast-success', { visible: true });

    const successMessage = await Utils.getToastrMessage(page);
    const protocolData = await Utils.getProtocol(page);

    return { successMessage, protocolData };
}