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
    // Financials for Credit Scoring
    revenue: {
        type: Number,
        required: true
    },
    debt: {
        type: Number,
        required: true
    },
    foundedYear: {
        type: Number,
        required: true
    },
    trustScore: {
        type: Number,
        default: 50 // Base score
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// Indexes for frequent search queries
companySchema.index({ sector: 1 });
companySchema.index({ fundingGoal: 1 });
companySchema.index({ businessName: 'text', description: 'text' }); // Text search

module.exports = mongoose.model('Company', companySchema);
