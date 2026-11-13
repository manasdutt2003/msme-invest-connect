const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = require('../config/secrets');

module.exports = async function (req, res, next) {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        // Load the role from the database so it cannot go stale or be forged,
        // and so a token for a deleted account stops working.
        const user = await User.findById(decoded.user.id).select('role');
        if (!user) {
            return res.status(401).json({ message: 'Token is not valid' });
        }
        req.user = { id: user.id, role: user.role };
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};
