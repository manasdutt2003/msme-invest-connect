const Investment = require('../models/Investment');
const Company = require('../models/Company');
const User = require('../models/User');
const calculateMatchScore = require('../utils/matchmaker');

exports.getMyInvestments = async (req, res) => {
    try {
        // Populate company details to show name, etc.
        const investments = await Investment.find({ investor: req.user.id })
            .populate('company', 'businessName sector returnsPercentage');
        res.json(investments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.invest = async (req, res) => {
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
};

// Update Investor Preferences
exports.updatePreferences = async (req, res) => {
    const { preferences } = req.body; // Expect array of strings
    try {
        const user = await User.findById(req.user.id);
        user.preferences = preferences;
        await user.save();
        res.json(user.preferences);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get AI Recommendations
exports.getRecommendations = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user.preferences || user.preferences.length === 0) {
            return res.json([]);
        }

        const companies = await Company.find();

        const recommendations = companies.map(company => {
            const matchScore = calculateMatchScore(user.preferences, company);
            return {
                ...company._doc,
                matchScore
            };
        });

        // Sort by match score desc
        recommendations.sort((a, b) => b.matchScore - a.matchScore);

        // Return top 5
        res.json(recommendations.slice(0, 5));
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
