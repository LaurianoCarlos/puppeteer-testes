import { ROUTE } from '../../config/constant.mjs';
import { Utils } from '../../helpers/Utils.js';


/**
 * Preenche a seção de informações básicas do CPR.
 */
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
    await page.waitForSelector('#cpr_type', { visible: true });
    await page.select('#cpr_type', formData.cpr_type);

    await page.waitForSelector('#wallet', { visible: true });
    await page.select('#wallet', formData.wallet);

    await page.waitForSelector('#cpr_value', { visible: true });
    await page.type('#cpr_value', formData.cpr_value);

    await page.waitForSelector('#date', { visible: true });
    await page.type('#date', formData.date);

    await page.waitForSelector('#amendment_ratification_reratification', { visible: true });
    await page.type('#amendment_ratification_reratification', formData.amendment_ratification_reratification);
}

/**
 * Preenche a seção de informações do ativo.
 */
async function fillAsset(page, formData) {
    await Utils.expandSectionIfCollapsed(page, '#collapseMain', 'button[aria-controls="collapseMain"]');
    await page.waitForSelector('#participant_cnpj', { visible: true });
    await page.type('#participant_cnpj', formData.participant_cnpj);

    await page.waitForSelector('#asset_id', { visible: true });
    await page.type('#asset_id', formData.asset_id);

    await page.waitForSelector('#ipoc', { visible: true });
    await page.type('#ipoc', formData.ipoc);

    await page.waitForSelector('#issue_date', { visible: true });
    await page.type('#issue_date', formData.issue_date);

    await page.waitForSelector('#due_date', { visible: true });
    await page.type('#due_date', formData.due_date);

    await page.waitForSelector('#value', { visible: true });
    await page.type('#value', formData.value);

    await page.waitForSelector('#category_subcategory', { visible: true });
    await page.type('#category_subcategory', formData.category_subcategory);
}

/**
 * Preenche a seção de informações do CPR Verde.
 */
async function fillGreenCpr(page, formData) {
    // Expande a seção se estiver colapsada
    await Utils.expandSectionIfCollapsed(page, '#collapseGreen', 'button[aria-controls="collapseGreen"]');

    // Aguarda o checkbox estar visível
    await page.waitForSelector('#flexSwitchCheckDefault', { visible: true });

    // Marca o checkbox, se não estiver marcado
    await page.evaluate(() => {
        const checkbox = document.querySelector('#flexSwitchCheckDefault');
        if (checkbox && !checkbox.checked) {
            checkbox.click();
        }
    });


    // Aguarda até que os inputs estejam habilitados
    await Promise.all([
        waitForEnabled(page, '#corporate_name_certifier'),
        waitForEnabled(page, '#cnpj_certifier'),
        waitForEnabled(page, '#declaration'),
        waitForEnabled(page, '#georeferencing')
    ]);

    // Preenche os campos da seção
    const fields = [
        { selector: '#corporate_name_certifier', value: formData.corporate_name_certifier },
        { selector: '#cnpj_certifier', value: formData.cnpj_certifier },
        { selector: '#declaration', value: formData.declaration },
        { selector: '#georeferencing', value: formData.georeferencing }
    ];

    for (const field of fields) {
        await page.waitForSelector(field.selector, { visible: true });
        await page.type(field.selector, field.value);
    }
}

/**
 * Preenche a seção de informações do Creditor.
 */
async function fillCreditor(page, formData) {
    await Utils.expandSectionIfCollapsed(page, '#collapseIdentifiers', 'button[aria-controls="collapseIdentifiers"]');
    await page.waitForSelector('#creditor_name', { visible: true });
    await page.type('#creditor_name', formData.creditor_name);
    await page.waitForSelector('#creditor_cpf_cnpj', { visible: true });
    await page.type('#creditor_cpf_cnpj', formData.creditor_cpf_cnpj);
    await page.waitForSelector('#creditor_address', { visible: true });
    await page.type('#creditor_address', formData.creditor_address);
    await page.waitForSelector('#creditor_state', { visible: true });
    await page.type('#creditor_state', formData.creditor_state);
    await page.waitForSelector('#creditor_city', { visible: true });
    await page.type('#creditor_city', formData.creditor_city);
}

/**
 * Preenche a seção de informações do Debtor.
 */
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
        { selector: '#debtor_city', value: formData.debtor_city }
    ];

    for (const field of fields) {
        await page.waitForSelector(field.selector, { visible: true });
        await page.type(field.selector, field.value);
    }

    await page.waitForSelector('#debtor_document_type', { visible: true });
    await page.select('#debtor_document_type', formData.debtor_document_type);

    await page.waitForSelector('#gender', { visible: true });
    await page.select('#gender', formData.gender);

    await page.waitForSelector('#debtor_marital_status', { visible: true });
    await page.select('#debtor_marital_status', formData.debtor_marital_status);

    if (formData.debtor_marital_status === '2') {
        const spouseFields = [
            { selector: '#spouse_name', value: formData.spouse_name },
            { selector: '#debtor_spouse_cpf_cnpj', value: formData.spouse_cpf_cnpj },
            { selector: '#spouse_issuing_authority', value: formData.spouse_issuing_authority },
            { selector: '#debtor_spouse_email', value: formData.spouse_email }
        ];

        for (const field of spouseFields) {
            await page.waitForSelector(field.selector, { visible: true });
            await page.type(field.selector, field.value);
        }
    }
}


/**
 * Preenche a seção de informações do OtherIssuers.
 */
async function fillOtherIssuers(page, formData) {
    await Utils.expandSectionIfCollapsed(page, '#collapseOtherIssuersInfo', 'button[aria-controls="collapseOtherIssuersInfo"]');

    await page.waitForSelector('#issuer_name', { visible: true });
    await page.type('#issuer_name', formData.issuer_name);
    await page.waitForSelector('#issuer_cpf_cnpj', { visible: true });
    await page.type('#issuer_cpf_cnpj', formData.issuer_cpf_cnpj);
    await page.waitForSelector('#issuer_identity', { visible: true });
    await page.type('#issuer_identity', formData.issuer_identity);
    await page.waitForSelector('#issuer_authority', { visible: true });
    await page.type('#issuer_authority', formData.issuer_authority);
    await page.waitForSelector('#issuer_nationality', { visible: true });
    await page.type('#issuer_nationality', formData.issuer_nationality);
    await page.waitForSelector('#issuer_gender', { visible: true });
    await page.select('#issuer_gender', formData.issuer_gender);
    await page.waitForSelector('#issuer_profession', { visible: true });
    await page.type('#issuer_profession', formData.issuer_profession);
    await page.waitForSelector('#issuer_state', { visible: true });
    await page.type('#issuer_state', formData.issuer_state);
    await page.waitForSelector('#issuer_email', { visible: true });
    await page.type('#issuer_email', formData.issuer_email);
}

/**
 * Preenche a seção de informações do Product.
 */
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

        await page.waitForSelector('#harvest_description', { visible: true });
        await page.type('#harvest_description', harvest.harvest_description);

        await page.waitForSelector('#harvest_status', { visible: true });
        await page.select('#harvest_status', harvest.status);

        await page.waitForSelector('#product_quantity', { visible: true });
        await page.type('#product_quantity', harvest.product_quantity);

        await page.waitForSelector('#product_unit_select', { visible: true });
        await page.select('#product_unit_select', harvest.product_unit);

        await page.waitForSelector('#packing_standard', { visible: true });
        await page.type('#packing_standard', harvest.packing_standard);

        await page.waitForSelector('#quotation_source', { visible: true });
        await page.type('#quotation_source', harvest.quotation_source);

        await page.waitForSelector('#quotation_market', { visible: true });
        await page.type('#quotation_market', harvest.quotation_market)

        await page.waitForSelector('#quotation_index', { visible: true });
        await page.type('#quotation_index', harvest.quotation_index)

        await page.waitForSelector('#quotation_date', { visible: true });
        await page.type('#quotation_date', harvest.quotation_date);

        await page.waitForSelector('#unit_value', { visible: true });
        await page.type('#unit_value', harvest.unit_value);

        await page.waitForSelector('#planting_date', { visible: true });
        await page.type('#planting_date', harvest.planting_date);

    }

    // Expande e preenche "Entrega da Safra"
    await Utils.expandSectionIfCollapsed(page, '#collapseHarvestDelivery', 'button[aria-controls="collapseHarvestDelivery"]');

    if (formData.harvest_delivery) {
        const delivery = formData.harvest_delivery;

        await page.waitForSelector('#harvest_description_delivery', { visible: true });
        await page.type('#harvest_description_delivery', delivery.address);

        await page.waitForSelector('#delivery_address', { visible: true });
        await page.type('#delivery_address', delivery.address);

        await page.waitForSelector('#city', { visible: true });
        await page.type('#city', delivery.city);


        await page.waitForSelector('#state', { visible: true });
        await page.type('#state', delivery.state);


        await page.waitForSelector('#delivery_due_date', { visible: true });
        await page.type('#delivery_due_date', delivery.delivery_due_date);


        await page.waitForSelector('#payment_method', { visible: true });
        await page.type('#payment_method', delivery.payment_method);


        await page.waitForSelector('#settlement_schedule', { visible: true });
        await page.type('#settlement_schedule', delivery.settlement_schedule);


        await page.waitForSelector('#delivery_conditions', { visible: true });
        await page.type('#delivery_conditions', delivery.delivery_conditions);

        await page.waitForSelector('#delivered_quantity', { visible: true });
        await page.type('#delivered_quantity', delivery.delivered_quantity);

        await page.waitForSelector('#early_maturity_date', { visible: true });
        await page.type('#early_maturity_date', delivery.early_maturity_date);

    }

    // Expande e preenche "Informações da Negociação"
    await Utils.expandSectionIfCollapsed(page, '#collapseNegotiation', 'button[aria-controls="collapseNegotiation"]');

    if (formData.negotiation) {
        const negotiation = formData.negotiation;
        await page.waitForSelector('#product_negotiation_currency', { visible: true });
        await page.type('#product_negotiation_currency', negotiation.currency);

        await page.waitForSelector('#exchange_rate_variation', { visible: true });
        await page.type('#exchange_rate_variation', negotiation.exchange_rate_variation);

        await page.waitForSelector('#interest_rate_percentage', { visible: true });
        await page.type('#interest_rate_percentage', negotiation.interest_rate_percentage);

        await page.waitForSelector('#product_negotiation_trading_term', { visible: true });
        await page.type('#product_negotiation_trading_term', negotiation.trading_term);
    
        await page.waitForSelector('#correction_factor', { visible: true });
        await page.type('#correction_factor', negotiation.correction_factor.toString());

        await page.waitForSelector('#observation', { visible: true });
        await page.type('#observation', negotiation.observation);

        await page.waitForSelector('#product_negotiation_settlement_method', { visible: true });
        await page.type('#product_negotiation_settlement_method', negotiation.settlement_method);

        await page.waitForSelector('#product_negotiation_settlement_condition', { visible: true });
        await page.type('#product_negotiation_settlement_condition', negotiation.settlement_condition);

        await page.waitForSelector('#product_negotiation_first_installment_date', { visible: true });
        await page.type('#product_negotiation_first_installment_date', negotiation.first_installment_date);

        await page.waitForSelector('#product_negotiation_settlement_date', { visible: true });
        await page.type('#product_negotiation_settlement_date', negotiation.settlement_date);

        await page.waitForSelector('#product_negotiation_early_maturity_date', { visible: true });
        await page.type('#product_negotiation_early_maturity_date', negotiation.early_maturity_date);
    }
}

/**
 * Preenche a seção de informações do Property.
 */
async function fillProperty(page, formData) {
    await Utils.expandSectionIfCollapsed(page, '#collapseProperty', 'button[aria-controls="collapseProperty"]');


    await page.waitForSelector('#property_production_area', { visible: true });
    await page.type('#property_production_area', formData.production_area.toString());


    await page.waitForSelector('#property_production_area_unit', { visible: true });
    await page.type('#property_production_area_unit', formData.production_area_unit);


    await page.waitForSelector('#property_total_area', { visible: true });
    await page.type('#property_total_area', formData.total_area.toString());


    await page.waitForSelector('#property_total_area_unit', { visible: true });
    await page.type('#property_total_area_unit', formData.total_area_unit);
}

/**
 * Preenche a seção de informações do PropertyImmobile.
 */
async function fillPropertyImmobile(page, formData) {

    await Utils.expandSectionIfCollapsed(page, '#collapsePropertyImmobile', 'button[aria-controls="collapsePropertyImmobile"]');
    await page.waitForSelector('#property_immobile\\.0\\.property_identification', { visible: true });
    await page.type('#property_immobile\\.0\\.property_identification', formData.property_identification);
    await page.waitForSelector('#property_immobile\\.0\\.property_type', { visible: true });
    await page.type('#property_immobile\\.0\\.property_type', formData.property_type);
    await page.waitForSelector('#property_immobile\\.0\\.state', { visible: true });
    await page.type('#property_immobile\\.0\\.state', formData.state);
    await page.waitForSelector('#property_immobile\\.0\\.city', { visible: true });
    await page.type('#property_immobile\\.0\\.city', formData.city);
    await page.waitForSelector('#property_immobile\\.0\\.registry_office', { visible: true });
    await page.type('#property_immobile\\.0\\.registry_office', formData.registry_office);
    await page.waitForSelector('#property_immobile\\.0\\.registration_number', { visible: true });
    await page.type('#property_immobile\\.0\\.registration_number', formData.registration_number);
}

/**
 * Preenche a seção de informações do ImmobileCoordinates.
 */
async function fillImmobileCoordinates(page, formData) {
    await Utils.expandSectionIfCollapsed(page, '#collapseImmobileCoordinates', 'button[aria-controls="collapseImmobileCoordinates"]');
    await page.waitForSelector('#immobile_coordinates\\.0\\.tract', { visible: true });
    await page.type('#immobile_coordinates\\.0\\.tract', formData.tract);
    await page.waitForSelector('#immobile_coordinates\\.0\\.latitude', { visible: true });
    await page.type('#immobile_coordinates\\.0\\.latitude', formData.latitude);
    await page.waitForSelector('#immobile_coordinates\\.0\\.longitude', { visible: true });
    await page.type('#immobile_coordinates\\.0\\.longitude', formData.longitude);
}

/**
 * Preenche a seção de informações do Garantias.
 */
async function fillGarantias(page, formData) {
    await Utils.expandSectionIfCollapsed(page, '#collapseGuarantees', 'button[aria-controls="collapseGuarantees"]');

    const guaranteesData = formData.guarantees

    for (let index = 0; index < guaranteesData.length; index++) {
        const guarantee = guaranteesData[index];

        await page.select(`#guarantee_type_${index}`, guarantee.guarantee_type.toString());
        await page.waitForSelector(`#guarantee_value_${index}`, { visible: true });
        await page.type(`#guarantee_value_${index}`, guarantee.value.toString());
        await page.type(`#essentiality_of_guarantee_${index}`, guarantee.essentiality_of_guarantee);
        await page.type(`#guarantee_name_${index}`, guarantee.name);
        await page.type(`#guarantee_cpf_cnpj_${index}`, guarantee.cpf_cnpj);
        await page.type(`#guarantee_state_${index}`, guarantee.state);
        await page.type(`#guarantee_city_${index}`, guarantee.city);
        await page.type(`#guarantee_profession_${index}`, guarantee.profession);
        await page.type(`#guarantee_email_${index}`, guarantee.email);
        await page.type(`#guarantee_guarantor_type_${index}`, guarantee.guarantor_type);
        await page.type(`#guarantee_guarantor_cpf_cnpj_${index}`, guarantee.guarantor_cpf_cnpj);
        await page.type(`#guarantee_vehicle_owner_cpf_cnpj_${index}`, guarantee.vehicle_owner_cpf_cnpj);
        await page.type(`#guarantee_rural_property_owner_cpf_cnpj_${index}`, guarantee.rural_property_owner_cpf_cnpj);
        await page.type(`#guarantee_rural_real_estate_certificate_${index}`, guarantee.rural_real_estate_certificate);
        await page.type(`#guarantee_rural_real_estate_certificate_registration_${index}`, guarantee.rural_real_estate_certificate_registration);
        await page.type(`#guarantee_rural_real_estate_certificate_value_${index}`, guarantee.rural_real_estate_certificate_value);
        await page.type(`#guarantee_rural_real_estate_certificate_due_date_${index}`, guarantee.rural_real_estate_certificate_due_date);


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
export async function create(page, formData) {
    await page.goto(ROUTE.CPR_CREATE_BASE);

    await fillCpr(page, formData);
    await fillAsset(page, formData);
    await fillGreenCpr(page, formData);
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



/**
 * Aguarda até que o elemento esteja habilitado.
 */
async function waitForEnabled(page, selector) {
    await page.waitForFunction(
        (sel) => {
            const element = document.querySelector(sel);
            return element && !element.disabled;
        },
        {},
        selector
    );
}