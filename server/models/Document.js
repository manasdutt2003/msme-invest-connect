const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    filename: {
        type: String,
        required: true
    },
    originalName: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    mimeType: {
        type: String
    },
    size: {
        type: Number
    },
    allowedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    description: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Document', DocumentSchema);
