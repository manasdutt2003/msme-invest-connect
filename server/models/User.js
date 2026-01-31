const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['msme', 'investor'],
        default: 'msme'
    },
    verificationStatus: {
        type: String,
        enum: ['unverified', 'pending', 'verified', 'rejected'],
        default: 'unverified'
    },
    kycDocuments: [{
        docType: { type: String, enum: ['pan', 'udyam'] },
        filename: String,
        uploadedAt: { type: Date, default: Date.now }
    }],
    preferences: {
        type: [String], // Array of strings e.g. ["Technology", "Solar", "High Yield"]
        default: []
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);
