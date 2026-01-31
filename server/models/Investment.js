const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema({
    investor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    equity: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['INTERESTED', 'DUE_DILIGENCE', 'TERM_SHEET', 'COMPLETED', 'REJECTED'],
        default: 'INTERESTED'
    },
    termSheet: {
        valuation: Number,
        conditions: String,
        submittedAt: Date
    }
});

module.exports = mongoose.model('Investment', investmentSchema);
