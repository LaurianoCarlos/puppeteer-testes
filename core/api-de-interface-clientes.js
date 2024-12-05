import { createAxiosInstance } from './axiosInstance.js';
import { AUTH_REGISTRY_AGENT, API_DUPLICATAS_BASE_URL } from '../config/constant.mjs';

class ApiInterfaceService {
    static baseInstance = createAxiosInstance(API_DUPLICATAS_BASE_URL);

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

        const url = `protocols/${protocolId}?allData=true`;

        try {
            const response = await this.baseInstance.get(url, {
                timeout: 60000,
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
            const response = await this.baseInstance.get(`protocols?participantId=${AUTH_REGISTRY_AGENT}`,{ timeout: 60000 });
           
            return response.data.data;
        } catch (error) {
            console.error('Erro ao buscar protocolos:', error.response ? error.response.data : error.message);
            throw new Error('Erro ao buscar protocolos');
        }
    }


    /**
     * Fetch protocols
     * @returns {object} Protocol data.
     */
    static async getWallets() {
        try {
            const response = await this.baseInstance.get('wallets', { timeout: 60000 });
    
            return response.data.data;
        } catch (error) {
            console.error('Erro ao buscar Carteiras:', error.response ? error.response.data : error.message);
            throw new Error('Erro ao buscar Carteiras');
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
            const response = await this.baseInstance.get(url, {
                timeout: 60000,
            });
    
            return response.data.data;
        } catch (error) {
            console.error('Erro ao buscar duplicatas:', error.response ? error.response.data : error.message);
            throw new Error('Erro ao buscar duplicatas');
        }
    }

    /**
     * Fetch participant and data based on a slug.
     * @param {string} slug - The slug identifier.
     * @returns {Array} List.
     * @throws {Error} If the slug is not provided or the request fails.
     */
    static async findListByParticipant(slug) {
        if (!slug) {
            throw new Error('O slug deve ser fornecido.');
        }

        const url = `${slug}/participant/${AUTH_REGISTRY_AGENT}`;
        
        try {
            const response = await this.baseInstance.get(url, {
                timeout: 60000,
            });

            return response.data.data;
        } catch (error) {
            console.error('Erro ao buscar dados:', error.response ? error.response.data : error.message);
            throw new Error('Erro ao buscar dados');
        }
    }

   
    static async getAccreditors() {
        const url = `accreditors`;
        
        try {
            const response = await this.baseInstance.get(url, {
                timeout: 60000,
            });

            return response.data;
        } catch (error) {
            console.error('Erro ao buscar dados:', error.response ? error.response.data : error.message);
            throw new Error('Erro ao buscar dados');
        }
    }

    static async getConciliation() {
        const url = `conciliationUr?participant_id=${AUTH_REGISTRY_AGENT}`;
       
        try {
            const response = await this.baseInstance.get(url, {
                timeout: 60000,
            });
    
            return response.data.data;
        } catch (error) {
            console.log('Erro ao buscar dados:', error.response ? error.response.data : error.message);
            throw new Error('Erro ao buscar dados',  error.response);
        }
    }
}

export default ApiInterfaceService;
