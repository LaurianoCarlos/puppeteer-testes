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
            throw new Error('The protocol ID must be provided.');
        }

        const url = `protocols/${protocolId}?allData=true`;

        try {
            const response = await this.baseInstance.get(url, {
                timeout: 60000,
            });

            return response.data;
        } catch (error) {
            console.error('Error fetching protocol:', error.response ? error.response.data : error.message);
            throw new Error('Error fetching protocol');
        }
    }

    /**
     * Fetch all protocols.
     * @returns {object} Protocol data.
     * @throws {Error} If the request fails.
     */
    static async getProtocols() {
        try {
            const response = await this.baseInstance.get(`protocols?participantId=${AUTH_REGISTRY_AGENT}`, { timeout: 60000 });
            return response.data.data;
        } catch (error) {
            console.error('Error fetching protocols:', error.response ? error.response.data : error.message);
            throw new Error('Error fetching protocols');
        }
    }

    /**
     * Fetch all wallets.
     * @returns {object} Wallet data.
     * @throws {Error} If the request fails.
     */
    static async getWallets() {
        try {
            const response = await this.baseInstance.get('wallets', { timeout: 60000 });
            return response.data.data;
        } catch (error) {
            console.error('Error fetching wallets:', error.response ? error.response.data : error.message);
            throw new Error('Error fetching wallets');
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
            throw new Error('The slug must be provided.');
        }

        const url = `${slug}/registry-agent/${AUTH_REGISTRY_AGENT}`;
        
        try {
            const response = await this.baseInstance.get(url, {
                timeout: 60000,
            });

            return response.data.data;
        } catch (error) {
            console.error('Error fetching duplicates:', error.response ? error.response.data : error.message);
            throw new Error('Error fetching duplicates');
        }
    }

    /**
     * Fetch a list based on participant and slug.
     * @param {string} slug - The slug identifier.
     * @returns {Array} List of data.
     * @throws {Error} If the slug is not provided or the request fails.
     */
    static async findListByParticipant(slug) {
        if (!slug) {
            throw new Error('The slug must be provided.');
        }

        const url = `${slug}/participant/${AUTH_REGISTRY_AGENT}`;
        
        try {
            const response = await this.baseInstance.get(url, {
                timeout: 60000,
            });

            return response.data.data;
        } catch (error) {
            console.error('Error fetching data:', error.response ? error.response.data : error.message);
            throw new Error('Error fetching data');
        }
    }

    /**
     * Fetch a list of accreditors.
     * @returns {object} Accreditor data.
     * @throws {Error} If the request fails.
     */
    static async getAccreditors() {
        const url = `accreditors`;

        try {
            const response = await this.baseInstance.get(url, {
                timeout: 60000,
            });

            return response.data;
        } catch (error) {
            console.error('Error fetching accreditors:', error.response ? error.response.data : error.message);
            throw new Error('Error fetching accreditors');
        }
    }

    /**
     * Fetch receivables by ID.
     * @param {string} id - The identifier for receivables.
     * @returns {object} Receivable data.
     * @throws {Error} If the request fails.
     */
    static async getReceivables(id) {
        const url = `receivables/${id}`;

        try {
            const response = await this.baseInstance.get(url, {
                timeout: 60000,
            });

            return response.data;
        } catch (error) {
            console.error('Error fetching receivables:', error.response ? error.response.data : error.message);
            throw new Error('Error fetching receivables');
        }
    }

    /**
     * Fetch conciliation data.
     * @returns {object} Conciliation data.
     * @throws {Error} If the request fails.
     */
    static async getConciliation() {
        const url = `conciliationUr?participant_id=${AUTH_REGISTRY_AGENT}`;

        try {
            const response = await this.baseInstance.get(url, {
                timeout: 60000,
            });

            return response.data.data;
        } catch (error) {
            console.error('Error fetching conciliation data:', error.response ? error.response.data : error.message);
            throw new Error('Error fetching conciliation data');
        }
    }

    /**
     * Fetch wallets by code.
     * @param {string} code - The active type code.
     * @returns {object} Wallet data.
     * @throws {Error} If the request fails.
     */
    static async getWalletsByCode(code) {
        const url = `wallets?paginate=false&other_participant_id=${AUTH_REGISTRY_AGENT}&active_type_code=${code}`;

        try {
            const response = await this.baseInstance.get(url, {
                timeout: 60000,
            });

            return response.data;
        } catch (error) {
            console.error('Error fetching wallets by code:', error.response ? error.response.data : error.message);
            throw new Error('Error fetching wallets by code');
        }
    }
}

export default ApiInterfaceService;
