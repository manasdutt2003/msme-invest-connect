require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Request Logger
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Database Connection
const mongooseOptions = {
    serverSelectionTimeoutMS: 3000, // Fail fast (3s)
    family: 4 // Force IPv4
};

// Connect
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/msme_invest', mongooseOptions)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// Disable buffering - throw error if DB not ready
mongoose.set('bufferCommands', false);

// Routes Placeholder
app.get('/', (req, res) => {
    res.send('MSME Invest Connect API');
});

// Import Routes
const authRoutes = require('./routes/auth');
const companyRoutes = require('./routes/companies');
const investRoutes = require('./routes/invest');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/invest', investRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
