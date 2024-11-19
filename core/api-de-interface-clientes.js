import { createAxiosInstance } from './axiosInstance.js';
import { PROTOCOL_BASE, DUPLICATE_BASE, AUTH_REGISTRY_AGENT } from '../config/constant.mjs';

class ApiInterfaceService {
    static protocolInstance = createAxiosInstance(PROTOCOL_BASE);
    static duplicateInstance = createAxiosInstance(DUPLICATE_BASE);

    /**
     * Fetch protocol data by ID.
     * @param {string} protocolId - The protocol ID.
     * @returns {object} Protocol data.
     * @throws {Error} If the protocol ID is not provided or the request fails.
     */
    static async fetchProtocol(protocolId) {
        if (!protocolId) {
            throw new Error('O ID do protocolo deve ser fornecido.');
        }

        const protocolBase = `/${protocolId}?allData=true`;

        try {
            const response = await this.protocolInstance.get(protocolBase, {
                timeout: 30000,
            });

            return response.data;
        } catch (error) {
            console.error('Erro ao buscar protocolo:', error.response ? error.response.data : error.message);
            throw new Error('Erro ao buscar protocolo');
        }
    }

    /**
     * Fetch protocols
     * @returns {object} Protocol data.
     */
    static async getProtocols() {
        try {
            const response = await this.protocolInstance.get({ timeout: 30000 });

            return response.data.data;
        } catch (error) {
            console.error('Erro ao buscar protocolos:', error.response ? error.response.data : error.message);
            throw new Error('Erro ao buscar protocolos');
        }
    }

    /**
     * Fetch duplicate data based on a slug.
     * @param {string} slug - The slug identifier.
     * @returns {Array} List of duplicates.
     * @throws {Error} If the slug is not provided or the request fails.
     */
    static async findDuplicates(slug) {
        if (!slug) {
            throw new Error('O slug deve ser fornecido.');
        }

        const url = `${slug}/registry-agent/${AUTH_REGISTRY_AGENT}`;

        try {
            const response = await this.duplicateInstance.get(url, {
                timeout: 30000,
            });

            return response.data.data;
        } catch (error) {
            console.error('Erro ao buscar duplicatas:', error.response ? error.response.data : error.message);
            throw new Error('Erro ao buscar duplicatas');
        }
    }
}

export default ApiInterfaceService;
