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
        issuanceDate: faker.date.future().toISOString().split('T')[0],
    };
}

/**
 * Generates FiduciaryData.
 * @returns {object} FiduciaryData object.
 */
function generateFiduciaryData() {
    return {
        fiduciaryDocumentType: '2',
        fiduciaryDocument: faker.string.numeric(14),
        fiduciaryZipcode: faker.location.zipCode('#####-###'),
        fiduciaryDomicile: generateAddress(),
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
        assetDueDate: faker.date.future().toISOString().split('T')[0],
        assetValue: faker.finance.amount(10000, 50000, 2),
        totalContractValue: faker.finance.amount(50000, 200000, 2),
        installmentNumber: faker.string.numeric(1),
        totalInstallmentNumber: faker.string.numeric(2),
        assetDateTransfer: faker.date.future().toISOString().split('T')[0],
        ufPayment: generateBrazilianState(),
        invoice: faker.string.numeric(42),
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
