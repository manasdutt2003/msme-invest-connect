const { Worker } = require('worker_threads');
const path = require('path');

// Simple Map to track workers if needed, or just fire and forget for this demo
const workers = new Map();

/**
 * Run a background job
 * @param {string} workerFilename - Name of the worker file in 'workers' dir
 * @param {object} workerData - Data to pass to the worker
 * @returns {Promise} Resolve when worker sends 'done', Reject on error
 */
const runWorker = (workerFilename, workerData) => {
    return new Promise((resolve, reject) => {
        const workerPath = path.join(__dirname, '../workers', workerFilename);

        const worker = new Worker(workerPath, {
            workerData
        });

        worker.on('message', (message) => {
            if (message.status === 'done') {
                resolve(message.result);
            } else if (message.status === 'error') {
                reject(message.error);
            }
        });

        worker.on('error', (err) => {
            reject(err);
        });

        worker.on('exit', (code) => {
            if (code !== 0) {
                reject(new Error(`Worker stopped with exit code ${code}`));
            }
        });
    });
};

module.exports = { runWorker };
