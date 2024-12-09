import dotenv from 'dotenv';

dotenv.config();

export const BASE_URL = process.env.BASE_URL;
export const USER_PORTAL = process.env.USER_PORTAL;
export const PASSWORD = process.env.PASSWORD;
export const API_DUPLICATAS_BASE_URL = process.env.API_DUPLICATAS_BASE_URL
export const AUTH_BASE_URL = process.env.AUTH_BASE_URL
export const AUTH_LOGIN = process.env.AUTH_LOGIN
export const AUTH_PASSWORD = process.env.AUTH_PASSWORD
export const AUTH_REGISTRY_AGENT = process.env.AUTH_REGISTRY_AGENT


export const ROUTE = {
    WALLET_SEARCH_BASE: `${BASE_URL}wallet/search`,
    WALLET_CREATE_BASE: `${BASE_URL}wallet/create`,
    PROTOCOL_SEARCH_BASE: `${BASE_URL}protocol/search`,
    DUPLICATE_MERCANTIL_SEARCH_BASE: `${BASE_URL}duplicate-mercantil/search`,
    DUPLICATE_MERCANTIL_CREATE_BASE: `${BASE_URL}duplicate-mercantil/create`,
    DUPLICATE_SERVICE_SEARCH_BASE: `${BASE_URL}service-duplicate/search`,
    DUPLICATE_SERVICE_CREATE_BASE: `${BASE_URL}service-duplicate/create`,
    CONTRACT_MERCANTIL_SEARCH_BASE: `${BASE_URL}mercantil-contract/search`,
    CONTRACT_MERCANTIL_CREATE_BASE: `${BASE_URL}mercantil-contract/create`,
    CPR_SEARCH_BASE: `${BASE_URL}cpr/search`,
    CPR_CREATE_BASE: `${BASE_URL}cpr`,
    UR_SEARCH_BASE: `${BASE_URL}receivable/search`,
    UR_CREATE_BASE: `${BASE_URL}receivable`,
    RECEIVING_END_USER_SEARCH_BASE: `${BASE_URL}receiving-end-users/search`,
    RECEIVING_END_USER_CREATE_BASE: `${BASE_URL}receiving-end-users`,
    CONCILIATION_SEARCH_BASE: `${BASE_URL}conciliation/search`,
    CONCILIATION_CREATE_BASE: `${BASE_URL}conciliation`,
    CONTESTATION_SEARCH_BASE: `${BASE_URL}contestation/search`,
    CONTESTATION_CREATE_BASE: `${BASE_URL}contestation`,
    CONTRACT_EFFECTS_SEARCH_BASE: `${BASE_URL}contract-effects/search`,
    CONTRACT_EFFECTS_CREATE_BASE: `${BASE_URL}contract-effects`,
    OPTIN_SEARCH_BASE: `${BASE_URL}optin/search`,
    OPTIN_CREATE_BASE: `${BASE_URL}optin`,
};

export const SLUG = {
    CPR_SLUG: process.env.SLUG_CPR,
    UR_SLUG: process.env.SLUG_UR,
    DUPLICATE_MERCANTIL_SLUG: process.env.SLUG_DUPLICATE_MERCANTIL,
    DUPLICATE_SERVICE_SLUG: process.env.SLUG_DUPLICATE_SERVICE,
    CONTRACT_MERCANTIL_SLUG: process.env.SLUG_CONTRACT_MERCANTIL,
};

export const PROTOCOL_STATUS = {
    OPENED: process.env.STATUS_OPENED,
    CANCELLED: process.env.STATUS_CANCELLED,
    FINISHED: process.env.STATUS_FINISHED,
};

export const SERVICES = {
    WALLET: process.env.SERVICE_WALLET,
    CONCILIATION: process.env.SERVICE_CONCILIATION,
    CONTESTATION: process.env.SERVICE_CONTESTATION,
    CONTRACT_EFFECTS: process.env.SERVICE_CONTRACT_EFFECTS,
    CPR: process.env.SERVICE_CPR,
    UR: process.env.SERVICE_UR,
    OPTIN_OPTOUT: process.env.SERVICE_OPTIN_OPTOUT,
    RECEIVING_END_USERS: process.env.SERVICE_RECEIVING_END_USERS,
    DUPLICATE_MERCANTIL: process.env.SERVICE_DUPLICATE_MERCANTIL,
    SERVICE_DUPLICATE: process.env.SERVICE_DUPLICATE,
    CONTRACT_MERCANTIL: process.env.SERVICE_CONTRACT_MERCANTIL,
};

export const TIME = {
    ONE_MINUTE: 60000,     
    TWO_MINUTES: 120000,   
    THREE_MINUTES: 180000, 
    FOUR_MINUTES: 240000,  
    FIVE_MINUTES: 300000,
};
