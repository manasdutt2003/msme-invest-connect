const Investment = require('../models/Investment');
const Company = require('../models/Company');

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
