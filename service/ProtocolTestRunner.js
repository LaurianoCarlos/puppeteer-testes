import { expect } from 'chai';
import protocolLogger from '../service/ProtocolCSVLogger.js';
import { fetchProtocol } from '../core/api-de-interface-clientes.js';

class ProtocolTestRunner {
    async runTests() {
        const groupedItems = protocolLogger.groupByService();

        if (Object.keys(groupedItems).length === 0) {
            console.log('No protocols found in the CSV file.');
            return;
        }

        for (const [serviceName, protocols] of Object.entries(groupedItems)) {
            describe(`Testing service: ${serviceName}`, function () {
                for (const protocol of protocols) {
                    it(`Protocol ID ${protocol.id} should have the same status as expected: ${protocol.expected_status}`, async () => {
                        const fetchedProtocol = await fetchProtocol(protocol.id.trim());
                        const statusAtualServidor = fetchedProtocol.status;
                        const statusEsperadoCSV = protocol.expected_status.trim();

                        expect(statusAtualServidor).to.equal(
                            statusEsperadoCSV,
                            `Expected status "${statusEsperadoCSV}" but got "${statusAtualServidor}" for protocol ID: ${protocol.id}`
                        );
                    });
                }
            });
        }
    }
}

export default ProtocolTestRunner;
