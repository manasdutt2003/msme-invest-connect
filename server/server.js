require('dotenv').config();
require('./config/secrets'); // throws if JWT_SECRET is missing
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect first so the server never accepts requests it cannot serve.
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Documentation available at http://localhost:${PORT}/api-docs`);
    });
});
