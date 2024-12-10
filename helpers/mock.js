import { faker } from '@faker-js/faker';

/**
 * Generates ActionData.
 * @returns {object} ActionData object.
 */
function generateActionData() {
    return {
        occurrence: '1',
        mainParticipantCnpj: faker.string.numeric(14),
        wallet: faker.string.uuid(),
        externalReference: faker.string.uuid(),
    };
}

/**
 * Generates Identifiers.
 * @returns {object} Identifiers object.
 */
function generateIdentifiers() {
    return {
        contractId: faker.string.uuid(),
        assetId: faker.string.uuid(),
    };
}

/**
 * Generates HolderData.
 * @returns {object} HolderData object.
 */
function generateHolderData() {
    return {
        holderDocumentType: '1',
        holderDocument: faker.string.numeric(11),
        holderZipcode: faker.location.zipCode('#####-###'),
        holderDomicile: generateAddress(),
    };
}

/**
 * Generates NewHolderData.
 * @returns {object} NewHolderData object.
 */
function generateNewHolderData() {
    return {
        newHolderDocumentType: '1',
        newHolderDocument: faker.string.numeric(11),
        newHolderZipcode: faker.location.zipCode('#####-###'),
        newHolderDomicile: generateAddress(),
        assetValueTransfer: faker.finance.amount(1000, 10000, 2),
        issuanceDate: genericDate(),
    };
}



/**
 * Generates PayerDebtorData.
 * @returns {object} PayerDebtorData object.
 */
function generatePayerDebtorData() {
    return {
        payerDebtorDocumentType: '1',
        payerDebtorDocument: faker.string.numeric(11),
        payerDebtorZipcode: faker.location.zipCode('#####-###'),
        payerDebtorDomicile: generateAddress(),
    };
}

/**
 * Generates AssetData.
 * @returns {object} AssetData object.
 */
function generateAssetData() {
    return {
        assetDueDate: genericDate(),
        assetValue: faker.finance.amount(10000, 50000, 2),
        totalContractValue: faker.finance.amount(50000, 200000, 2),
        installmentNumber: faker.string.numeric(1),
        totalInstallmentNumber: faker.string.numeric(2),
        assetDateTransfer: genericDate(),
        ufPayment: generateBrazilianState(),
        invoice: faker.string.numeric(42),
    };
}

/**
 * Generates AssetData.
 * @returns {object} AssetData object.
 */
function generateFiduciaryData() {
    return {
        fiduciaryDocumentType: faker.helpers.arrayElement(['1', '2']),
        fiduciaryDocument: faker.helpers.arrayElement([
            faker.string.numeric(11),
            faker.string.numeric(14),
        ]),
        fiduciaryZipcode: faker.location.zipCode('#####-###'),
        fiduciaryDomicile: generateAddress(),
    };
}



/**
 * Generates OtherInformation.
 * @returns {object} OtherInformation object.
 */
function generateOtherInformation() {
    return {
        alternativeInformation: faker.lorem.paragraph(),
        assetInterestRate: faker.finance.amount(0, 10, 2),
        monetaryCorrectionIndex: faker.string.numeric(5),
        penalClause: faker.string.numeric(5),
        otherCharges: faker.string.numeric(5),
        additionalInformation: faker.string.numeric(5),
        otrValidationRule: faker.lorem.sentence(),
    };
}

/**
 * Generates a random address.
 * @returns {string} Random address.
 */
function generateAddress() {
    return `${faker.location.streetAddress()}, ${faker.location.city()}`;
}

/**
 * Generates a random Brazilian state abbreviation (uppercase).
 * @returns {string} Random Brazilian state abbreviation.
 */
function generateBrazilianState() {
    const brazilianStates = [
        'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
        'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
        'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
    ];
    return faker.helpers.arrayElement(brazilianStates);
}

/**
 * Generate data.
 * @returns  {string} string cnpj.
 */
export function cnpj() {
    return faker.string.numeric(14);
}

/**
 * Generate data.
 * @returns {string} string uuid.
 */
export function uuid() {
    return faker.string.uuid();
}

/**
 * Generate data.
 * @returns {string} string uuid.
 */
export function genericName() {
    return `Test ${faker.company.name()}`;
}

/**
 * Generate a random date from up to one year ago to the current date.
 * @returns {string} Formatted date in DD-MM-YYYY format.
 */
export function genericDate() {
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 1);

    const endDate = new Date();

    const randomDate = faker.date.between({ from: startDate, to: endDate });
    const formattedDate = `${randomDate.getDate().toString().padStart(2, '0')}-${(randomDate.getMonth() + 1).toString().padStart(2, '0')}-${randomDate.getFullYear()}`;
    return formattedDate;
}

/**
 * Generates a date with an offset in days from a given start date.
 * @param {string} startDate - The base date in 'DD-MM-YYYY' format.
 * @param {number} offsetDays - The number of days to add to the base date.
 * @returns {string} The new date in 'DD-MM-YYYY' format.
 */
function genericDateWithOffset(startDate, offsetDays) {
    const [day, month, year] = startDate.split('-').map(Number);
    const baseDate = new Date(year, month - 1, day);
    baseDate.setDate(baseDate.getDate() + offsetDays);

    const newDay = baseDate.getDate().toString().padStart(2, '0');
    const newMonth = (baseDate.getMonth() + 1).toString().padStart(2, '0');
    const newYear = baseDate.getFullYear();

    return `${newDay}-${newMonth}-${newYear}`;
}


/**
 * Generates CPR Data.
 * @returns {object} CPR Data object.
 */
function generateCprData() {
    return {
        cpr_type: '1',
        wallet: faker.string.uuid(),
        cpr_value: faker.finance.amount(10000, 100000, 2),
        date: genericDate(),
        amendment_ratification_reratification: faker.lorem.words(5),
    };
}

/**
 * Generates Asset Information.
 * @returns {object} Asset Information object.
 */
function generateAssetInformation() {
    return {
        participant_cnpj: faker.string.numeric(14),
        asset_id: faker.string.uuid(),
        ipoc: faker.string.uuid(),
        issue_date: genericDate(),
        due_date: genericDate(),
        value: faker.finance.amount(1000, 5000, 2),
        category_subcategory: faker.string.numeric(1),
    };
}

/**
 * Generates CPR Verde Data.
 * @returns {object} CPR Verde Data object.
 */
function generateCprGreenData() {
    return {
        isCprGreen: faker.datatype.boolean(),
        corporate_name_certifier: faker.company.name(),
        cnpj_certifier: faker.string.numeric(14),
        declaration: faker.lorem.paragraph(),
        georeferencing: faker.lorem.sentence(),
    };
}

/**
 * Generates Creditor Data.
 * @returns {object} Creditor Data object.
 */
function generateCreditorData() {
    return {
        creditor_name: faker.person.fullName(),
        creditor_cpf_cnpj: faker.string.numeric(14),
        creditor_address: faker.location.streetAddress(),
        creditor_state: generateBrazilianState(),
        creditor_city: faker.location.city(),
    };
}

/**
 * Generates Debtor Data.
 * @returns {object} Debtor Data object.
 */
function generateDebtorData() {
    return {
        debtor_name: faker.person.fullName(),
        identity: faker.string.numeric(9),
        debtor_document_type: '1',
        debtor_cpf_cnpj: faker.string.numeric(14),
        state_registration: faker.string.uuid(),
        municipal_registration: faker.string.uuid(),
        issuing_authority: faker.lorem.word(),
        nationality: faker.helpers.arrayElement(['Brasileiro', 'Estrangeiro']),
        gender: faker.helpers.arrayElement(['M', 'F']),
        profession: faker.person.jobTitle(),
        debtor_marital_status: faker.helpers.arrayElement(['1', '3', '4', '5']),
        email: faker.internet.email(),
        home_phone: faker.phone.number('## ####-####'),
        mobile_phone: faker.phone.number('## #####-####'),
        address: faker.location.streetAddress(),
        debtor_state: generateBrazilianState(),
        debtor_city: faker.location.city(),
        spouse_name: faker.person.fullName(),
        spouse_cpf_cnpj: faker.string.numeric(14),
        spouse_issuing_authority: faker.lorem.word(),
        spouse_email: faker.internet.email(),
    };
}

/**
 * Generates Harvest Data.
 * @returns {object} Harvest Data object.
 */
function generateIssuerData() {
    return {
        issuer_name: faker.person.fullName(),
        issuer_cpf_cnpj: faker.string.numeric(14),
        issuer_identity: faker.string.numeric(9),
        issuer_authority: faker.lorem.word(),
        issuer_nationality: faker.helpers.arrayElement(['Brasileiro', 'Estrangeiro']),
        issuer_gender: faker.helpers.arrayElement(['M', 'F']),
        issuer_profession: faker.person.jobTitle(),
        issuer_state: generateBrazilianState(),
        issuer_email: faker.internet.email(),
    };
}
/**
 * Generates Harvest Data.
 * @returns {object} Harvest Data object.
 */
function generateProductData() {
    return {
        product_query: faker.helpers.arrayElement(['ARROZ', 'FEIJAO']),
        product_code: faker.string.uuid(),
        product_description: faker.commerce.productDescription(),
        product_unit: faker.helpers.arrayElement(['UNID', 'CX']),
    };
}

/**
 * Generates Harvest Data.
 * @returns {object} Harvest Data object.
 */
function generateHarvestData() {
    return {
        harvest_description: faker.lorem.words(3),
        status: '1',
        product_quantity: faker.string.numeric(1),
        product_unit: faker.helpers.arrayElement(['AMPOLA', 'BALDE', 'BANDEJA', 'BARRA', 'BISNAG', 'BOBINA', 'SACO']),
        packing_standard: faker.lorem.words(2),
        quotation_source: faker.company.name(),
        quotation_market: faker.lorem.word(),
        quotation_index: faker.string.numeric(2),
        quotation_date: genericDate(),
        unit_value: faker.finance.amount(10, 100, 2),
        planting_date: genericDate(),
    };
}

/**
 * Generates Harvest Delivery Data.
 * @returns {object} Harvest Delivery Data object.
 */
function generateHarvestDeliveryData() {
    return {
        description: faker.lorem.words(3),
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        state: generateBrazilianState(),
        delivery_due_date: genericDate(),
        payment_method: faker.lorem.words(2),
        settlement_schedule: faker.lorem.words(2),
        delivery_conditions: faker.lorem.words(2),
        delivered_quantity: faker.string.numeric(2),
        early_maturity_date: genericDate(),
    };
}

/**
 * Generates Negotiation Data.
 * @returns {object} Negotiation Data object.
 */
function generateNegotiationData() {
    return {
        currency: faker.finance.currencyCode(),
        exchange_rate_variation: faker.finance.amount(0.01, 10, 2),
        interest_rate_percentage:  faker.string.numeric(1),
        trading_term: faker.lorem.words(2),
        correction_factor: faker.string.numeric(1),
        observation: faker.lorem.sentence(),
        settlement_method: faker.lorem.word(),
        settlement_condition: faker.lorem.words(3),
        first_installment_date: genericDate(),
        settlement_date: genericDate(),
        early_maturity_date: genericDate(),
    };
}

/**
 * Generates Guarantees Data.
 * @returns {object} Guarantees Data object.
 */
function generateGuaranteesData() {
    return [
        {
            guarantee_type: '1',
            value: faker.finance.amount(1000, 10000, 2),
            essentiality_of_guarantee: faker.lorem.sentence(),
            name: faker.person.fullName(),
            cpf_cnpj: faker.string.numeric(14),
            state: generateBrazilianState(),
            city: faker.location.city(),
            profession: faker.person.jobTitle(),
            email: faker.internet.email(),
            guarantor_type: faker.lorem.word(),
            guarantor_cpf_cnpj: faker.string.numeric(14),
            vehicle_owner_cpf_cnpj: faker.string.numeric(14),
            rural_property_owner_cpf_cnpj: faker.string.numeric(14),
            rural_real_estate_certificate: faker.string.alphanumeric(10),
            rural_real_estate_certificate_registration: faker.string.alphanumeric(10),
            rural_real_estate_certificate_value: faker.finance.amount(10, 100, 2),
            rural_real_estate_certificate_due_date: genericDate(),
        },
    ];
}

/**
 * Generates Guarantees Data.
 * @returns {object} Guarantees Data object.
 */
function generatePropertyData() {
    return {
        production_area: faker.string.numeric(1),
        production_area_unit: 'hectares',
        total_area: faker.string.numeric(1),
        total_area_unit: 'hectares',
        property_identification: faker.string.uuid(),
        property_type: faker.lorem.word(),
        state: generateBrazilianState(),
        city: faker.location.city(),
        registry_office: faker.lorem.words(2),
        registration_number: faker.string.uuid(),
        tract: faker.lorem.word(),
        latitude: faker.string.numeric(2),
        longitude: faker.string.numeric(2),
    };
}

/**
 * Generates Receiving Data.
 * @returns {object} Receiving Data object.
 */
export function generateReceivingAndUser() {
    return {
        document_type: 'CNPJ', 
        document_number: cnpj(), 
        accreditor_document_number: cnpj(),
        arrangements: faker.helpers.arrayElement(['VCC', 'MCC', 'MCD']), 
        type: faker.helpers.arrayElement(['CC', 'CD', 'CG', 'CI', 'PG', 'PP']), 
        number: faker.string.numeric(5), 
        digit: faker.string.numeric(1), 
        agency: faker.string.numeric(4), 
        ispb: faker.string.numeric(8),
    };
}


/**
 * Generates the complete DuplicateMercantilForm.
 * @returns {object} DuplicateMercantilForm object.
 */
export function generateDuplicateMercantilForm() {
    return {
        ...generateActionData(),
        ...generateIdentifiers(),
        ...generateHolderData(),
        ...generateNewHolderData(),
        ...generateFiduciaryData(),
        ...generatePayerDebtorData(),
        ...generateAssetData(),
        ...generateOtherInformation(),
    };
}

/**
 * Generates the complete DuplicateMercantilForm.
 * @returns {object} DuplicateMercantilForm object.
 */
export function generateServiceDuplicateForm() {
    return {
        ...generateActionData(),
        ...generateIdentifiers(),
        ...generateHolderData(),
        ...generateNewHolderData(),
        ...generateFiduciaryData(),
        ...generatePayerDebtorData(),
        ...generateAssetData(),
        ...generateOtherInformation(),
    };
}

/**
 * Generates the complete DuplicateMercantilForm.
 * @returns {object} DuplicateMercantilForm object.
 */
export function generateContratoMercantilForm() {
    return {
        ...generateActionData(),
        ...generateIdentifiers(),
        ...generateHolderData(),
        ...generateNewHolderData(),
        ...generateFiduciaryData(),
        ...generatePayerDebtorData(),
        ...generateAssetData(),
        ...generateOtherInformation(),
    };
}

export function mockFormData() {
    return {
        ...generateCprData(),
        ...generateAssetInformation(),
        ...generateCprGreenData(),
        ...generateCreditorData(),
        ...generateDebtorData(),
        ...generateIssuerData(),
        ...generateProductData(),
        ...generatePropertyData(),
        harvest: generateHarvestData(),
        harvest_delivery: generateHarvestDeliveryData(),
        negotiation: generateNegotiationData(),
        guarantees: generateGuaranteesData(),
    };
}

/**
 * Generates formData with reused data from existing generators.
 * @returns {object} Generated formData.
 */
export function mockReceivingEndUsers() {
    const creditorData = generateCreditorData();
    const debtorData = generateDebtorData();

    return {
        document_type: 'CNPJ',
        document_number: debtorData.debtor_cpf_cnpj,
        accreditor_document_number: creditorData.creditor_cpf_cnpj,
        arrangements: faker.helpers.arrayElement(['VCC', 'MCC', 'MCD']),
        type: faker.helpers.arrayElement(['CC', 'CD', 'CG', 'CI', 'PG', 'PP']),
        number: faker.string.numeric(5),
        digit: faker.string.numeric(1),
        agency: faker.string.numeric(4),
        ispb: faker.string.numeric(8),
    };
    
}

/**
 * Generates formData with reused data from existing generators.
 * @returns {object} Generated formData.
 */
export function mockConciliation() {
    const creditorData = generateCreditorData();
    const debtorData = generateDebtorData();

    return {
        reference_date: genericDate(),
        participant_cnpj: creditorData.creditor_cpf_cnpj,
        holder_cnpj: debtorData.debtor_cpf_cnpj,
        effect_type: faker.helpers.arrayElement(['1', '2', '3', '4']),
        operation_modality:  faker.helpers.arrayElement(['1', '2', '3']),
        quantity_contracts: faker.string.numeric(1),
        quantity_contractors: faker.string.numeric(1),
        total_debt_balance:  faker.finance.amount(10, 100, 2),
        wallet: ' ',
    };
    
}


/**
 * Generates formData with reused data from existing generators.
 * @returns {object} Generated formData.
 */
export function mockContestation() {
    const creditorData = generateCreditorData();
    const debtorData = generateDebtorData();

    return {
        identifier: uuid(),
        external_reference:uuid(),
        receiver_document: creditorData.creditor_cpf_cnpj,
        receiving_end_user_document: debtorData.debtor_cpf_cnpj,
        recipient_document:faker.string.numeric(14),
        reason: faker.helpers.arrayElement(['1', '2', '3', '4', '5', '6']),
        description: faker.commerce.productDescription(),
        type: faker.helpers.arrayElement(['1', '2']),
        operation_id: uuid(),
        date: genericDate(),
        type_contestant: faker.helpers.arrayElement(['1', '2', '3', '4', '5', '6'])
    };
}

/**
 * Generates formData with reused data from existing generators.
 * @returns {object} Generated formData.
 */
export function mockContractEffects() {
    const creditorData = generateCreditorData();
    const warranties = generateReceivingAndUser();

    return {
        external_reference: uuid(),
        contract_reference: uuid(),
        receiving_end_user_document_number: creditorData.creditor_cpf_cnpj,
        is_renegotiation: faker.helpers.arrayElement(['1','0']),
        previous_contract_reference: faker.person.jobTitle(),
        participant_document_number: faker.string.numeric(14),
        holder_document_number: faker.string.numeric(14),
        effect_type: faker.helpers.arrayElement(['1','2','3','4']),
        outstanding_balance: faker.finance.amount(1000, 10000, 2),
        warranty_operation_limit: faker.string.numeric(1),
        minimum_value_maintained: faker.finance.amount(1000, 10000, 2),
        due_date:  genericDate(),
        signature_date:  genericDate(),
        manager_reference: faker.person.jobTitle(),
        operation_modality: faker.helpers.arrayElement(['1','2','3']),
        wallet: " ",
        interest_rate: faker.string.numeric(1),
        installments: {
            installment_date: genericDate(),
            installment_value: faker.finance.amount(1000, 10000, 2),
        },
        warranties: {
            external_reference: uuid(),
            division_rule: faker.string.numeric(2),
            charged_value: faker.finance.amount(1000, 10000, 2),
            payment_account: {
                document_number: warranties.document_number,
                holder_name:faker.company.name(),
                account_type: faker.helpers.arrayElement(['1','2']),
                ispb: warranties.ispb,
                agency: warranties.agency,
                account_number:warranties.number,
                comp: faker.string.numeric(2, 10, 20),
            },
            receivables: {
                accreditor_document_number: cnpj(),
                receiving_end_user_document_number: cnpj(),
                holder_document_number: cnpj(),
                arrangements: faker.helpers.arrayElement(['VCC', 'MCC', 'MCD']),
                start_date: genericDate(),
                end_date: genericDate(),
            },
        },
    };
}


/**
 * Generates formData with reused data from existing generators.
 * @returns {object} Generated formData.
 */
export function mockOptin() {

    const start_date_optin = genericDate();
    const final_date_optin = genericDateWithOffset(start_date_optin, 7);

    const start_due_date = genericDate();
    const final_due_date = genericDateWithOffset(start_due_date, 10);

    return {
        external_reference: uuid(),
        wallet: 'wallet', 
        receiver_document: faker.string.numeric(11),
        start_date_optin,
        final_date_optin,
        receivable: {
            receiving_end_users: faker.string.numeric(11),
            holder_document: faker.string.numeric(11),
            arrangements: faker.helpers.arrayElement(['VCC', 'MCC', 'MCD']),
            accreditors: faker.string.numeric(14), 
            start_due_date,
            final_due_date,
        },
    };
}


/**
 * Generates formData with reused data from existing generators.
 * @returns {object} Generated formData.
 */
export function mockCcb() {
    return {
        holder_document_number: faker.string.numeric(11),
        wallet: uuid(),
        external_reference: uuid(),
        registry_agent: uuid(),
        contact_uuid: uuid(),
        sub_code: faker.string.numeric(5),
        credit_operation_modality_code: faker.helpers.arrayElement(['1', '2', '3']),
        transaction_date: genericDate(),
        total_credit_amount: faker.finance.amount(10000, 500000, 2),
        net_credit_value: faker.finance.amount(9000, 490000, 2),
        indexing: faker.helpers.arrayElement(['1', '2', '3', '4' ,'5']),
        interest_rate: faker.finance.amount(0.01, 10, 2),
        number_contracted_installments: faker.string.numeric(1),
        protocol: uuid(),

        creditors: {
            document_number: faker.string.numeric(14),
        },

        debtors: {
            document_number: faker.string.numeric(11),
            email: faker.internet.email(),
            social_name: faker.person.fullName(),
            zipcode: faker.location.zipCode('#####-###'),
            phone: faker.phone.number('## #####-####'),
        },

        recipient: {
            document_number: faker.string.numeric(11),
            type: faker.helpers.arrayElement(['1', '2']),
            agency: faker.string.numeric(4),
            account: faker.string.numeric(10),
        },

        guarantors: {
            document_number: faker.string.numeric(11),
            description: faker.commerce.productDescription(),
        },

        installments: {
            status: faker.helpers.arrayElement(['1', '2', '3', '4' ,'5', '6', '7']),
            control_code: faker.string.alphanumeric(10),
            due_date: genericDate(),
            number: faker.string.numeric(1),
            value: faker.string.numeric(2),
            main_value: faker.finance.amount(1000, 50000, 2),
        },

        issuer: {
            document_number: faker.string.numeric(14),
            company_name: faker.company.name(),
        },

        warranties: {
            type: faker.helpers.arrayElement(['1', '2', '3']),
            description: faker.commerce.productDescription(),
            value: faker.string.numeric(2),
            identifier: uuid(),
            license_plate: faker.vehicle.vrm(),
            chassis: faker.string.alphanumeric(17),
            model_year:  faker.helpers.arrayElement(['2021', '2022', '2023','2024']),
            state: generateBrazilianState(),
            document_reference: faker.string.alphanumeric(10),
            registration_number: uuid(),
            registry_office_identification: faker.string.alphanumeric(10),
            address: generateAddress(),
            number: faker.string.numeric(4),
            city: faker.location.city(),
            country: 'Brasil',
            building_type: faker.lorem.word(),
        },
    };
}

/**
 * Generates formData with reused data from existing generators.
 * @returns {object} Generated formData.
 */
export function mockCdca() {
    return {
            holder_document_number: faker.string.numeric(14),
            wallet: uuid(),
            external_reference: uuid(),
            registry_agent: uuid(),
            contact_uuid: uuid(),
            code_contract_operation_credit: faker.string.alphanumeric(6),
            transaction_date: genericDate(),
            total_credit_amount: faker.finance.amount(10000, 50000, 2),
            net_credit_value: faker.finance.amount(5000, 30000, 2),
            indexing: faker.helpers.arrayElement(['1', '2', '3']),
            interest_rate: faker.finance.amount(0, 10, 2),
            number_contracted_installments: faker.string.numeric(1),
            protocol: uuid(),
            delivery_date: genericDate(),
            conciliation_id: uuid(),

        agents: {
            document_number: faker.string.numeric(14),
            type: faker.helpers.arrayElement(['0', '1']),
            email: faker.internet.email(),
        },
        creditors: {
            document_number: faker.string.numeric(14),
            liquidation_document_number: faker.string.numeric(14),
            email: faker.internet.email(),
            liquidation_holder_name: faker.person.fullName(),
            liquidation_type: faker.helpers.arrayElement(['CD', 'CG', 'CI', 'PG', 'PP']),
            liquidation_bank: faker.finance.bic(),
            liquidation_agency: faker.string.numeric(4),
            liquidation_number: faker.string.numeric(10),
        },
        debtors: {
            document_number: faker.string.numeric(14), 
            email: "devedor@exemplo.com", 
            company_name: faker.company.name(), 
            zipcode: faker.location.zipCode('#####-###'),
            phone: faker.phone.number('## #####-####'), 
        },
        installments: {
            status: faker.helpers.arrayElement(['1', '2', '3']),
            control_code: faker.string.uuid(),
            due_date: genericDate(),
            number: faker.string.numeric(2),
            value: faker.finance.amount(100, 1000, 2),
        },
        issuer: {
            document_number: faker.string.numeric(14),
            company_name: faker.company.name(),
        },
        original_creditor: {
            document_number: faker.string.numeric(14),
            company_name: faker.company.name(),
        },
    };
}

/**
 * Generates formData with reused data from existing generators.
 * @returns {object} Generated formData.
 */
export function mockPortfolio() {
    return {
        reference:uuid(),
        description: faker.lorem.sentence(),
        total_amount: faker.finance.amount(1000, 100000, 2),
        items: Array.from({ length: 1 }, () => ({
            document_number: faker.string.numeric(14),
            asset_uuid:uuid(),
            description: faker.commerce.productDescription(),
            value: faker.finance.amount(100, 10000, 2),
            due_date: genericDate(),
            original_register_date: genericDate(),
            company_name: faker.company.name(),
        })),
    };
}
