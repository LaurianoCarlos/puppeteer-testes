import { createAxiosInstance } from './axiosInstance.js';
import { PROTOCOL_BASE } from '../config/constant.mjs';

const axiosInstance = createAxiosInstance(PROTOCOL_BASE);

export async function fetchProtocol(protocolId) {
  if (!protocolId) {
    throw new Error('O ID do protocolo deve ser fornecido.');
  }

  const protocolBase = `/${protocolId}?allData=true`;

  try {
    const response = await axiosInstance.get(protocolBase, {
      timeout: 20000,
    });
  
    return response.data; 
  } catch (error) {
    console.error('Erro ao buscar protocolo:', error.response ? error.response.data : error.message);
    throw new Error('Erro ao buscar protocolo');
  }
}
