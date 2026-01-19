const express = require('express');
const router = express.Router();
const Investment = require('../models/Investment');
const Company = require('../models/Company');
const jwt = require('jsonwebtoken');

// Middleware to verify token (Basic implementation)
const auth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// Get User's Investments
router.get('/my-investments', auth, async (req, res) => {
    try {
        // Populate company details to show name, etc.
        const investments = await Investment.find({ investor: req.user.id })
            .populate('company', 'businessName sector returnsPercentage');
        res.json(investments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Make an Investment
router.post('/', auth, async (req, res) => {
    const { companyId, amount } = req.body;

    try {
        const company = await Company.findById(companyId);
        if (!company) return res.status(404).json({ message: 'Company not found' });

        const investment = new Investment({
            investor: req.user.id,
            company: companyId,
            amount
        });

        await investment.save();

        // Update company raised amount
        company.amountRaised += parseInt(amount);
        await company.save();

        res.json(investment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
