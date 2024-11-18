import fs from 'fs';
import path from 'path';
import { parse } from 'json2csv';

class ProtocolCSVLogger {
    constructor(filePath) {
        const storageDir = path.join(process.cwd(), 'storage');
        this.ensureStorageDir(storageDir);

        this.filePath = filePath || path.join(storageDir, 'protocols.csv');
        this.fields = ['id', 'service', 'current_status', 'expected_status'];
        this.initializeCSV();
    }

    ensureStorageDir(storageDir) {
        if (!fs.existsSync(storageDir)) {
            fs.mkdirSync(storageDir, { recursive: true });
        }
    }

    initializeCSV() {
        if (!fs.existsSync(this.filePath)) {
            const headerString = this.fields.join(';') + '\n';
            fs.writeFileSync(this.filePath, headerString, 'utf8');
        }
    }

    addProtocol(protocol, expectedStatus, service) {
        const formattedProtocol = {
            id: protocol.protocolId,
            service: service,
            current_status: this.formatStatus(protocol.status),
            expected_status: expectedStatus,
        };

        try {
            const csvData = parse([formattedProtocol], { fields: this.fields, header: false,  delimiter: ';' });
            fs.appendFileSync(this.filePath, csvData + '\n', 'utf8');
        } catch (error) {
            throw new Error(`Error saving protocol to CSV file: ${error.message}`);
        }
    }

    reset() {
        const headers = this.fields.join(';') + '\n';
        try {
            fs.writeFileSync(this.filePath, headers, 'utf8');
        } catch (error) {
            throw new Error(`Error when resetting CSV file: ${error.message}`);
        }
    }

    groupByService() {
        try {
            const csvContent = fs.readFileSync(this.filePath, 'utf8');
            const registros = csvContent
                .split('\n')
                .slice(1) 
                .map(line => line.split(';'))
                .filter(row => row.length > 1);

            const groupedProtocols = registros.reduce((acc, [id, serviceName, current_status, expected_status]) => {
                const protocol = {
                    id: id.trim().replace(/"/g, ''),
                    service: serviceName.trim().replace(/"/g, ''),
                    current_status: current_status.trim().replace(/"/g, ''),
                    expected_status: expected_status.trim().replace(/"/g, ''),
                };

                if (!acc[protocol.service]) {
                    acc[protocol.service] = [];
                }
                acc[protocol.service].push(protocol);

                return acc;
            }, {});

            return groupedProtocols;
        } catch (error) {
            throw new Error(`Error when grouping protocols by service: ${error.message}`);
        }
    }

    formatStatus(status) {
        switch (status.toUpperCase()) {
            case 'EM ABERTO':
                return 'opened';
            case 'CANCELADO':
                return 'cancelled';
            case 'FINALIZADO':
                return 'finished';
            default:
                return status.toLowerCase();
        }
    }
}

const protocolLogger = new ProtocolCSVLogger();
export default protocolLogger;
