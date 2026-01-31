const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateTokens = (user) => {
    const accessToken = jwt.sign(
        { user: { id: user.id } },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '15m' }
    );
    const refreshToken = jwt.sign(
        { user: { id: user.id } },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '7d' }
    );
    return { accessToken, refreshToken };
};

exports.register = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        user = new User({ name, email, password, role });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        const { accessToken, refreshToken } = generateTokens(user);

        // Send Refresh Token in HttpOnly Cookie
        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.json({ token: accessToken, user: { id: user.id, name: user.name, role: user.role } });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid Credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid Credentials' });

        const { accessToken, refreshToken } = generateTokens(user);

        // Send Refresh Token in HttpOnly Cookie
        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.json({ token: accessToken, user: { id: user.id, name: user.name, role: user.role } });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.refresh = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' });

    const refreshToken = cookies.jwt;

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET || 'secret');
        const user = await User.findById(decoded.user.id);
        if (!user) return res.status(401).json({ message: 'Unauthorized' });

        const accessToken = jwt.sign(
            { user: { id: user.id } },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '15m' }
        );

        res.json({ token: accessToken });
    } catch (err) {
        console.error(err.message);
        res.status(403).json({ message: 'Forbidden' });
    }
};

exports.logout = (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); // No content
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production' });
    res.json({ message: 'Cookie cleared' });
};
