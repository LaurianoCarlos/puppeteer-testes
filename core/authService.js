import axios from 'axios';
import { AUTH_BASE_URL, AUTH_LOGIN, AUTH_PASSWORD } from '../config/constant.mjs';

let accessToken = null;

export async function getToken() {
  if (accessToken) {
    return accessToken;
  }

  try {
    const response = await axios.post(AUTH_BASE_URL, {
      login: AUTH_LOGIN,
      password: AUTH_PASSWORD,
    });
    accessToken = response.data.access_token;
    return accessToken;
  } catch (error) {
    throw new Error('Erro ao obter o token', error);
  }
}

export function clearToken() {
  accessToken = null;
}
