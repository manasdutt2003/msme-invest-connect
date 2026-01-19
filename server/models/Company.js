const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    businessName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    sector: {
        type: String,
        required: true
    },
    fundingGoal: {
        type: Number,
        required: true
    },
    amountRaised: {
        type: Number,
        default: 0
    },
    returnsPercentage: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Company', companySchema);
