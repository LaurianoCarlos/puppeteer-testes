import dotenv from 'dotenv';

dotenv.config();

export const BASE_URL = process.env.BASE_URL;
export const USER = process.env.USER;
export const PASSWORD = process.env.PASSWORD;
export const API_DUPLICATAS_BASE_URL = process.env.API_DUPLICATAS_BASE_URL
export const AUTH_BASE_URL = process.env.AUTH_BASE_URL
export const AUTH_LOGIN = process.env.AUTH_LOGIN
export const AUTH_PASSWORD = process.env.AUTH_PASSWORD


//wallet
export const WALLET_SEARCH_BASE = BASE_URL + 'wallet/search';
export const WALLET_CREATE_BASE = BASE_URL + 'wallet/create';

export const PROTOCOL_SEARCH_BASE = BASE_URL + 'protocol/search';

export const DUPLICATE_MERCANTIL_SEARCH_BASE = BASE_URL + 'duplicate-mercantil/search';
export const DUPLICATE_MERCANTIL_CREATE_BASE = BASE_URL + 'duplicate-mercantil/create';

//Protocol
export const PROTOCOL_BASE = API_DUPLICATAS_BASE_URL + 'protocols'

export const CAPTCHA_API_KEY = '6Ldrx1sqAAAAANlLlEoUpBFedoZs_1zhFH0rgzNs';

export const TIME = {
    ONE_MINUTE: 60000,     
    TWO_MINUTES: 120000,   
    THREE_MINUTES: 180000, 
    FOUR_MINUTES: 240000,  
    FIVE_MINUTES: 300000 
};
