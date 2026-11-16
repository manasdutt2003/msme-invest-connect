const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const swaggerUI = require('swagger-ui-express');
const swaggerSpecs = require('./docs/swagger');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Import Routes
const authRoutes = require('./routes/auth');
const companyRoutes = require('./routes/companies');
const investRoutes = require('./routes/invest');

const app = express();

// Middleware
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
// Comma-separated list of frontend origins allowed to send credentials.
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(cors({ origin: allowedOrigins, credentials: true }));

// Request Logger (silenced in tests to keep output readable)
app.use((req, res, next) => {
    if (process.env.NODE_ENV !== 'test') {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    }
    next();
});

// Documentation
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpecs));

// Routes
app.get('/', (req, res) => {
    res.send('MSME Invest Connect API');
});

// Liveness/readiness probe: 200 when MongoDB is connected, 503 otherwise.
app.get('/api/health', (req, res) => {
    const connected = mongoose.connection.readyState === 1;
    res.status(connected ? 200 : 503).json({
        status: connected ? 'ok' : 'degraded',
        db: connected ? 'connected' : 'disconnected',
        uptimeSeconds: Math.round(process.uptime()),
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/invest', investRoutes);
app.use('/api/documents', require('./routes/documents'));
app.use('/api/verification', require('./routes/verification'));

// Unknown API paths get a JSON 404 rather than the React app's index.html.
app.use('/api', (req, res) => {
    res.status(404).json({ message: 'Not found' });
});

// Uploaded KYC and vault files are private. They are only reachable through
// the authenticated /api/documents/:id/download route, never as static files.

// Serve client build
app.use(express.static(path.join(__dirname, '../client/dist')));

// Handle React routing, return all requests to React app
app.get('/{*splat}', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'dist', 'index.html'));
});


// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    const status = err.status || err.statusCode || (err.code === 'LIMIT_FILE_SIZE' ? 413 : 500);
    // Do not leak file-system paths from failed static-file lookups.
    const message = err.code === 'ENOENT' ? 'Not found' : status >= 500 ? 'Something broke!' : err.message;
    res.status(err.code === 'ENOENT' ? 404 : status).json({ message });
});

module.exports = app;
