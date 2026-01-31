const express = require('express');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const swaggerSpecs = require('./docs/swagger');

// Import Routes
const authRoutes = require('./routes/auth');
const companyRoutes = require('./routes/companies');
const investRoutes = require('./routes/invest');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Request Logger
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Documentation
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpecs));

// Routes
app.get('/', (req, res) => {
    res.send('MSME Invest Connect API');
});

app.use('/api/auth', authRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/invest', investRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

module.exports = app;
