import { createAxiosInstance } from './axiosInstance.js';
import { PROTOCOL_BASE, DUPLICATE_BASE, AUTH_REGISTRY_AGENT} from '../config/constant.mjs';

const axiosInstance = createAxiosInstance(PROTOCOL_BASE);
const duplicateInstance = createAxiosInstance(DUPLICATE_BASE);

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

export async function findDuplicates(slug) {
 
  const url = `${slug}/registry-agent/${AUTH_REGISTRY_AGENT}`;
  
  try {
    const response = await duplicateInstance.get(url, {
      timeout: 20000,
    });
  
    return response.data.data; 
  } catch (error) {
    console.error('Erro ao buscar duplicatas:', error.response ? error.response.data : error.message);
    throw new Error('Erro ao buscar protocolo');
  }
}
