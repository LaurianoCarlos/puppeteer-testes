import { ROUTE } from '../../config/constant.mjs';
import { Utils } from '../../helpers/Utils.js';

/**
 * Requests a certificate by asset type and ID, then fetches protocol data from the table.
 * @param {object} page - Puppeteer page instance.
 * @param {string} assetType - The type of the asset.
 * @param {string} assetUuid - The UUID of the asset.
 * @returns {Array} - Array of protocol data.
 */
export async function requestCertificateByWallet(page, assetType, walletUuid) {
    await page.goto(ROUTE.CERTIFICATE_CREATE_BASE);

    const fields = [
      { selector: 'select#emit_by', type: 'select', value: '2' },
      { selector: 'select#asset_type', type: 'select', value: assetType },
      { selector: 'select#wallet_uuid', type: 'select', value: walletUuid },
    ];
    await Utils.fillInFields(page, fields);

    await Utils.forcedClick(page, 'button[type="submit"]');

    await Utils.waitForTableResults(page);
    const protocolData = await Utils.getProtocol(page);

    return protocolData;
}

