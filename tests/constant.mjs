import dotenv from 'dotenv';

dotenv.config();

export const BASE_URL = process.env.BASE_URL;
export const USER = process.env.USER;
export const PASSWORD = process.env.PASSWORD;


//wallet
export const WALLET_SEARCH_BASE = BASE_URL + 'wallet/search'
export const WALLET_CREATE_BASE = BASE_URL + 'wallet/create'