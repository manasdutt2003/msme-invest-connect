const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
    document: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document',
        required: true
    },
    viewer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    action: {
        type: String,
        enum: ['VIEW', 'DOWNLOAD', 'SHARED'],
        required: true
    },
    details: {
        type: String
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('AuditLog', AuditLogSchema);
