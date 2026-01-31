require('dotenv').config();
const express = require('express'); // Explicitly require express if not already (it is in app.js usually but good to be safe or check app.js) -- wait, app is imported. Let's check app.js.
// Actually, usually cookie-parser is middleware added to the app instance.
const cookieParser = require('cookie-parser');
const app = require('./app');
const connectDB = require('./config/db');
const verificationRoutes = require('./routes/verification');
const path = require('path');
const cors = require('cors'); // Added path module for static serving

app.use(cookieParser()); // Use cookie parser

// Connect to Database
connectDB();

// Use Routes (Assuming other routes like auth, users, companies are already defined or will be added)
// For this specific instruction, only adding the verification route use.
app.use('/api/verification', verificationRoutes); // Added this line

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve static assets in production
// Serve static assets (React App)
// Set static folder
app.use(express.static(path.join(__dirname, '../client/dist')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'dist', 'index.html'));
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Documentation available at http://localhost:${PORT}/api-docs`);
});
