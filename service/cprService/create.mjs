import { ROUTE } from '../../config/constant.mjs';
import { Utils } from '../../helpers/Utils.js';

async function fillInFields(page, fields) {
    for (const field of fields) {
        await page.waitForSelector(field.selector, { visible: true });

        if(field.type === 'select'){
            await page.select(field.selector, field.value);
        } else {
            await page.type(field.selector, field.value);
        }
    }
}

async function fillCpr(page, formData) { 

    await page.evaluate(() => {
        document.querySelector('#assetAccordion').scrollIntoView();
    });

    await page.evaluate(() => {
        document.querySelector('#collapseCprInfo').scrollIntoView();
    });

    await page.evaluate(() => {
        document.querySelector('#collapseButton').click();
    });

    await page.waitForSelector('#collapseCprInfo.show', { visible: true });

    const fields = [
        { selector: '#cpr_type', value: formData.cpr_type, type: 'select' },
        { selector: '#wallet', value: formData.wallet, type: 'select' },
        { selector: '#cpr_value', value: formData.cpr_value },
        { selector: '#date', value: formData.date },
        { selector: '#amendment_ratification_reratification', value: formData.amendment_ratification_reratification }
    ];
    await fillInFields(page, fields);
}

async function fillAsset(page, formData) {
    await Utils.expandSectionIfCollapsed(page, '#collapseMain', 'button[aria-controls="collapseMain"]');
    
    const fields = [
        { selector: '#participant_cnpj', value: formData.participant_cnpj },
        { selector: '#asset_id', value: formData.asset_id },
        { selector: '#ipoc', value: formData.ipoc },
        { selector: '#issue_date', value: formData.issue_date },
        { selector: '#due_date', value: formData.due_date },
        { selector: '#value', value: formData.value },
        { selector: '#category_subcategory', value: formData.category_subcategory }
    ];

    await fillInFields(page, fields);
}

async function fillGreenCpr(page, formData) {
    await Utils.expandSectionIfCollapsed(page, '#collapseGreen', 'button[aria-controls="collapseGreen"]');

    await page.waitForSelector('#flexSwitchCheckDefault', { visible: true });
    await page.evaluate(() => {
        const checkbox = document.querySelector('#flexSwitchCheckDefault');
        if (checkbox && !checkbox.checked) {
            checkbox.click();
        }
    });

    await Promise.all([
        waitForEnabled(page, '#corporate_name_certifier'),
        waitForEnabled(page, '#cnpj_certifier'),
        waitForEnabled(page, '#declaration'),
        waitForEnabled(page, '#georeferencing')
    ]);

    const fields = [
        { selector: '#corporate_name_certifier', value: formData.corporate_name_certifier },
        { selector: '#cnpj_certifier', value: formData.cnpj_certifier },
        { selector: '#declaration', value: formData.declaration },
        { selector: '#georeferencing', value: formData.georeferencing }
    ];

    await fillInFields(page, fields);
}

async function fillCreditor(page, formData) {
    await Utils.expandSectionIfCollapsed(page, '#collapseIdentifiers', 'button[aria-controls="collapseIdentifiers"]');

    const fields = [
        { selector: '#creditor_name', value: formData.creditor_name },
        { selector: '#creditor_cpf_cnpj', value: formData.creditor_cpf_cnpj },
        { selector: '#creditor_address', value: formData.creditor_address },
        { selector: '#creditor_state', value: formData.creditor_state },
        { selector: '#creditor_city', value: formData.creditor_city }
    ];

    await fillInFields(page, fields);
}

async function fillDebtor(page, formData) {
    await Utils.expandSectionIfCollapsed(page, '#collapseDebtorInfo', 'button[aria-controls="collapseDebtorInfo"]');

    const fields = [
        { selector: '#debtor_name', value: formData.debtor_name },
        { selector: '#identity', value: formData.identity },
        { selector: '#debtor_cpf_cnpj', value: formData.debtor_cpf_cnpj },
        { selector: '#state_registration', value: formData.state_registration },
        { selector: '#municipal_registration', value: formData.municipal_registration },
        { selector: '#issuing_authority', value: formData.issuing_authority },
        { selector: '#nationality', value: formData.nationality },
        { selector: '#profession', value: formData.profession },
        { selector: '#email', value: formData.email },
        { selector: '#home_phone', value: formData.home_phone },
        { selector: '#mobile_phone', value: formData.mobile_phone },
        { selector: '#address', value: formData.address },
        { selector: '#debtor_state', value: formData.debtor_state },
        { selector: '#debtor_city', value: formData.debtor_city },
        { selector: '#debtor_document_type', value: formData.debtor_document_type , type: 'select'},
        { selector: '#gender', value: formData.gender },
        { selector: '#debtor_marital_status', value: formData.debtor_marital_status, type: 'select' }
    ];

    await fillInFields(page, fields);

    if (formData.debtor_marital_status === '2') {
        const spouseFields = [
            { selector: '#spouse_name', value: formData.spouse_name },
            { selector: '#debtor_spouse_cpf_cnpj', value: formData.spouse_cpf_cnpj },
            { selector: '#spouse_issuing_authority', value: formData.spouse_issuing_authority },
            { selector: '#debtor_spouse_email', value: formData.spouse_email }
        ];

        await fillInFields(page, spouseFields);
    }
}

async function fillOtherIssuers(page, formData) {
    await Utils.expandSectionIfCollapsed(page, '#collapseOtherIssuersInfo', 'button[aria-controls="collapseOtherIssuersInfo"]');

    const fields = [
        { selector: '#issuer_name', value: formData.issuer_name },
        { selector: '#issuer_cpf_cnpj', value: formData.issuer_cpf_cnpj },
        { selector: '#issuer_identity', value: formData.issuer_identity },
        { selector: '#issuer_authority', value: formData.issuer_authority },
        { selector: '#issuer_nationality', value: formData.issuer_nationality },
        { selector: '#issuer_gender', value: formData.issuer_gender, type: 'select' },
        { selector: '#issuer_profession', value: formData.issuer_profession },
        { selector: '#issuer_state', value: formData.issuer_state },
        { selector: '#issuer_email', value: formData.issuer_email }
    ];

    await fillInFields(page, fields);
}

async function fillProduct(page, formData) {
    await Utils.expandSectionIfCollapsed(page, '#collapseProduct', 'button[aria-controls="collapseProduct"]');

    await page.waitForSelector('#product_query', { visible: true });
    await page.type('#product_query', formData.product_query);
    await page.click('.btn-search-query');

    await page.waitForSelector('.modal-content', { visible: true });

    const itemIndex = 0;

    await page.evaluate((index) => {
        const button = document.querySelectorAll('.list-group-item .btn-light')[index];
        if (button) {
            button.click();
        } else {
            throw new Error(`Item com índice ${index} não encontrado.`);
        }
    }, itemIndex);

    await page.waitForSelector('.modal-content', { hidden: true });

    await page.evaluate(() => {
        document.querySelector('#headingHarvest').scrollIntoView();
    });

    await page.waitForSelector('#buttonHarvest', { visible: true });
    await page.evaluate(() => {
        const button = document.querySelector('#buttonHarvest');
        if (button) {
            button.click();
        } else {
            throw new Error('Botão não encontrado!');
        }
    });
    
    await page.waitForSelector('.collapse.show', { visible: true });
    

    if (formData.harvest) {
        const harvest = formData.harvest;

        const fields = [
            { selector: '#harvest_description', value: harvest.harvest_description },
            { selector: '#harvest_status', value: harvest.status, type: 'select' },
            { selector: '#product_quantity', value: harvest.product_quantity },
            { selector: '#product_unit_select', value: harvest.product_unit, type: 'select' },
            { selector: '#packing_standard', value: harvest.packing_standard },
            { selector: '#quotation_source', value: harvest.quotation_source },
            { selector: '#quotation_market', value: harvest.quotation_market },
            { selector: '#quotation_index', value: harvest.quotation_index },
            { selector: '#quotation_date', value: harvest.quotation_date },
            { selector: '#unit_value', value: harvest.unit_value },
            { selector: '#planting_date', value: harvest.planting_date }
        ];

        await fillInFields(page, fields);
    }

    //Entrega da Safra
    await Utils.expandSectionIfCollapsed(page, '#collapseHarvestDelivery', 'button[aria-controls="collapseHarvestDelivery"]');

    if (formData.harvest_delivery) {
        const delivery = formData.harvest_delivery;

        const fields = [
            { selector: '#harvest_description_delivery', value: delivery.address },
            { selector: '#delivery_address', value: delivery.address },
            { selector: '#city', value: delivery.city },
            { selector: '#state', value: delivery.state },
            { selector: '#delivery_due_date', value: delivery.delivery_due_date },
            { selector: '#payment_method', value: delivery.payment_method },
            { selector: '#settlement_schedule', value: delivery.settlement_schedule },
            { selector: '#delivery_conditions', value: delivery.delivery_conditions },
            { selector: '#delivered_quantity', value: delivery.delivered_quantity },
            { selector: '#early_maturity_date', value: delivery.early_maturity_date }
        ];

        await fillInFields(page, fields);
    }

    //Informações da Negociação
    await Utils.expandSectionIfCollapsed(page, '#collapseNegotiation', 'button[aria-controls="collapseNegotiation"]');

    if (formData.negotiation) {
        const negotiation = formData.negotiation;

        const fields = [
            { selector: '#product_negotiation_currency', value: negotiation.currency },
            { selector: '#exchange_rate_variation', value: negotiation.exchange_rate_variation },
            { selector: '#interest_rate_percentage', value: negotiation.interest_rate_percentage },
            { selector: '#product_negotiation_trading_term', value: negotiation.trading_term },
            { selector: '#correction_factor', value: negotiation.correction_factor.toString() },
            { selector: '#observation', value: negotiation.observation },
            { selector: '#product_negotiation_settlement_method', value: negotiation.settlement_method },
            { selector: '#product_negotiation_settlement_condition', value: negotiation.settlement_condition },
            { selector: '#product_negotiation_first_installment_date', value: negotiation.first_installment_date },
            { selector: '#product_negotiation_settlement_date', value: negotiation.settlement_date },
            { selector: '#product_negotiation_early_maturity_date', value: negotiation.early_maturity_date }
        ];

        await fillInFields(page, fields);
    }
}

async function fillProperty(page, formData) {
    await Utils.expandSectionIfCollapsed(page, '#collapseProperty', 'button[aria-controls="collapseProperty"]');

    const fields = [
        { selector: '#property_production_area', value: formData.production_area },
        { selector: '#property_production_area_unit', value: formData.production_area_unit },
        { selector: '#property_total_area', value: formData.total_area },
        { selector: '#property_total_area_unit', value: formData.total_area_unit }
    ];

    await fillInFields(page, fields);
}

async function fillPropertyImmobile(page, formData) {

    await Utils.expandSectionIfCollapsed(page, '#collapsePropertyImmobile', 'button[aria-controls="collapsePropertyImmobile"]');

    const fields = [
        { selector: '#property_immobile\\.0\\.property_identification', value: formData.property_identification },
        { selector: '#property_immobile\\.0\\.property_type', value: formData.property_type },
        { selector: '#property_immobile\\.0\\.state', value: formData.state },
        { selector: '#property_immobile\\.0\\.city', value: formData.city },
        { selector: '#property_immobile\\.0\\.registry_office', value: formData.registry_office },
        { selector: '#property_immobile\\.0\\.registration_number', value: formData.registration_number }
    ];

    await fillInFields(page, fields);
}

async function fillImmobileCoordinates(page, formData) {
    await Utils.expandSectionIfCollapsed(page, '#collapseImmobileCoordinates', 'button[aria-controls="collapseImmobileCoordinates"]');

    const fields = [
        { selector: '#immobile_coordinates\\.0\\.tract', value: formData.tract },
        { selector: '#immobile_coordinates\\.0\\.latitude', value: formData.latitude },
        { selector: '#immobile_coordinates\\.0\\.longitude', value: formData.longitude }
    ];

    await fillInFields(page, fields);
}

async function fillGarantias(page, formData) {
    await Utils.expandSectionIfCollapsed(page, '#collapseGuarantees', 'button[aria-controls="collapseGuarantees"]');

    const guaranteesData = formData.guarantees

    for (let index = 0; index < guaranteesData.length; index++) {
        const guarantee = guaranteesData[index];

        const fields = [
            { selector: `#guarantee_type_${index}`, value: guarantee.guarantee_type.toString(), type: 'select' },
            { selector: `#guarantee_value_${index}`, value: guarantee.value.toString() },
            { selector: `#essentiality_of_guarantee_${index}`, value: guarantee.essentiality_of_guarantee },
            { selector: `#guarantee_name_${index}`, value: guarantee.name },
            { selector: `#guarantee_cpf_cnpj_${index}`, value: guarantee.cpf_cnpj },
            { selector: `#guarantee_state_${index}`, value: guarantee.state },
            { selector: `#guarantee_city_${index}`, value: guarantee.city },
            { selector: `#guarantee_profession_${index}`, value: guarantee.profession },
            { selector: `#guarantee_email_${index}`, value: guarantee.email },
            { selector: `#guarantee_guarantor_type_${index}`, value: guarantee.guarantor_type },
            { selector: `#guarantee_guarantor_cpf_cnpj_${index}`, value: guarantee.guarantor_cpf_cnpj },
            { selector: `#guarantee_vehicle_owner_cpf_cnpj_${index}`, value: guarantee.vehicle_owner_cpf_cnpj },
            { selector: `#guarantee_rural_property_owner_cpf_cnpj_${index}`, value: guarantee.rural_property_owner_cpf_cnpj },
            { selector: `#guarantee_rural_real_estate_certificate_${index}`, value: guarantee.rural_real_estate_certificate },
            { selector: `#guarantee_rural_real_estate_certificate_registration_${index}`, value: guarantee.rural_real_estate_certificate_registration },
            { selector: `#guarantee_rural_real_estate_certificate_value_${index}`, value: guarantee.rural_real_estate_certificate_value },
            { selector: `#guarantee_rural_real_estate_certificate_due_date_${index}`, value: guarantee.rural_real_estate_certificate_due_date }
        ];

        await fillInFields(page, fields);

        if (index < guaranteesData.length - 1) {
            await page.click('span[wire\\:click="addGuarantee"]');
        }
    }
}

/**
 * Automates the process of filling out and submitting the Duplicate Service form.
 * @param {object} page - Puppeteer page instance.
 * @param {object} formData - The form data to be filled.
 * @returns {object} An object containing the success message and protocol data.
 */
export async function create(page, formData, $greenCpr = true) {
    await page.goto(ROUTE.CPR_CREATE_BASE);

    await fillCpr(page, formData);
    await fillAsset(page, formData);

    if($greenCpr){
        await fillGreenCpr(page, formData);
    }

    await fillCreditor(page, formData);
    await fillDebtor(page, formData);
    await fillOtherIssuers(page, formData);
    await fillProduct(page, formData);
    await fillProperty(page, formData);
    await fillPropertyImmobile(page, formData);
    await fillImmobileCoordinates(page, formData);
    await fillGarantias(page, formData);

    await page.waitForSelector('#submitButton', { visible: true });
    await page.click('#submitButton');

    const successMessage = await Utils.getToastrMessage(page);
    const protocolData = await Utils.getProtocol(page);

    return { successMessage, protocolData };
}
