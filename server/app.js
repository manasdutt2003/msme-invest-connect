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
app.use('/api/verification', require('./routes/verification'));

// Serve static assets (React App)
const path = require('path');
// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve client build
app.use(express.static(path.join(__dirname, '../client/dist')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'dist', 'index.html'));
});


// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

module.exports = app;
