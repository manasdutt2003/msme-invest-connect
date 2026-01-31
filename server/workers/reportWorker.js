const { parentPort, workerData } = require('worker_threads');

// Simulate heavy task (e.g. PDF generation)
const generateReport = async () => {
    try {
        const { userId, reportType } = workerData;

        // Simulate delay (CPU work)
        const start = Date.now();
        while (Date.now() - start < 3000) {
            // heavy loop
        }

        // Mock result
        const result = {
            filename: `report_${userId}_${Date.now()}.pdf`,
            generatedAt: new Date().toISOString(),
            status: 'completed'
        };

        parentPort.postMessage({ status: 'done', result });

    } catch (err) {
        parentPort.postMessage({ status: 'error', error: err.message });
    }
};

generateReport();
