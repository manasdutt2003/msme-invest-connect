// Fail at start-up rather than silently signing tokens with a known value.
const secret = process.env.JWT_SECRET;
if (!secret) {
    throw new Error('JWT_SECRET is not set. Copy server/.env.example to server/.env.');
}

module.exports = { JWT_SECRET: secret };
