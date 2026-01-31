const Company = require('../models/Company');
const User = require('../models/User');

exports.getAllCompanies = async (req, res) => {
    try {
        let companies = await Company.find();

        // SEEDING LOGIC: If no companies exist, create some demo ones
        if (companies.length === 0) {
            console.log('Seeding demo companies...');

            // Find or create a demo MSME user 'owner'
            let owner = await User.findOne({ email: 'demo@msme.com' });

            const demoCompanies = [
                {
                    businessName: "Green Textiles Pvt Ltd",
                    description: "Sustainable textile manufacturing for export markets.",
                    sector: "Textiles",
                    fundingGoal: 500000,
                    amountRaised: 120000,
                    returnsPercentage: 12
                },
                {
                    businessName: "AgroTech Innovations",
                    description: "IoT solutions for modern farming equipment.",
                    sector: "Agriculture",
                    fundingGoal: 1000000,
                    amountRaised: 450000,
                    returnsPercentage: 15
                },
                {
                    businessName: "Solar Components Co",
                    description: "Manufacturing high-efficiency solar panel parts.",
                    sector: "Energy",
                    fundingGoal: 2000000,
                    amountRaised: 0,
                    returnsPercentage: 10
                }
            ];

            let dummyUser = await User.findOne();
            if (dummyUser) {
                const companiesWithOwner = demoCompanies.map(c => ({ ...c, owner: dummyUser._id }));
                await Company.insertMany(companiesWithOwner);
                companies = await Company.find(); // Re-fetch
            }
        }

        res.json(companies);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getMyCompany = async (req, res) => {
    try {
        // Find company where owner matches the logged in user
        const company = await Company.findOne({ owner: req.user.id });
        if (!company) {
            return res.status(404).json({ message: 'No company found for this user' });
        }
        res.json(company);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.createCompany = async (req, res) => {
    const { businessName, description, sector, fundingGoal, returnsPercentage } = req.body;

    try {
        // Check if user already has a company
        let company = await Company.findOne({ owner: req.user.id });
        if (company) {
            return res.status(400).json({ message: 'You already have a company listed' });
        }

        const newCompany = new Company({
            owner: req.user.id,
            businessName,
            description,
            sector,
            fundingGoal,
            returnsPercentage
        });

        const savedCompany = await newCompany.save();
        res.json(savedCompany);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
