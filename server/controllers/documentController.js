const Document = require('../models/Document');
const AuditLog = require('../models/AuditLog');
const User = require('../models/User');
const path = require('path');
const fs = require('fs');

// Upload Document
exports.uploadDocument = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const { description } = req.body;

        const newDoc = new Document({
            owner: req.user.id,
            filename: req.file.filename,
            originalName: req.file.originalname,
            path: req.file.path,
            mimeType: req.file.mimetype,
            size: req.file.size,
            description
        });

        await newDoc.save();
        res.json(newDoc);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get My Documents (MSME) or Shared with Me (Investor)
exports.getDocuments = async (req, res) => {
    try {
        // If MSME, showing own docs. If Investor, showing docs shared with them.
        let query;
        if (req.user.role === 'msme') {
            query = { owner: req.user.id };
        } else {
            query = { allowedUsers: req.user.id };
        }

        const docs = await Document.find(query)
            .populate('owner', 'name')
            .sort({ createdAt: -1 });

        res.json(docs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Share Document
exports.shareDocument = async (req, res) => {
    const { documentId, investorId } = req.body;

    try {
        const doc = await Document.findById(documentId);
        if (!doc) return res.status(404).json({ message: 'Document not found' });

        // Ensure ownership
        if (doc.owner.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Add investor if not already added
        if (!doc.allowedUsers.includes(investorId)) {
            doc.allowedUsers.push(investorId);
            await doc.save();

            // Log Action
            await new AuditLog({
                document: doc._id,
                viewer: req.user.id,
                action: 'SHARED',
                details: `Shared with user ${investorId}`
            }).save();
        }

        res.json(doc);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Access/Download Document
exports.downloadDocument = async (req, res) => {
    try {
        const doc = await Document.findById(req.params.id);
        if (!doc) return res.status(404).json({ message: 'Document not found' });

        // Check permissions: Owner OR is in allowedUsers
        const isOwner = doc.owner.toString() === req.user.id;
        const isAllowed = doc.allowedUsers.includes(req.user.id);

        if (!isOwner && !isAllowed) {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Log Access (if not owner, or maybe log owners too? Let's log everyone for audit trail)
        await new AuditLog({
            document: doc._id,
            viewer: req.user.id,
            action: 'DOWNLOAD'
        }).save();

        // Serve file
        // Construct absolute path. stored path is relative or absolute? Multer stores relative usually 'uploads/...'
        const filePath = path.join(__dirname, '../../', doc.path);

        if (fs.existsSync(filePath)) {
            res.download(filePath, doc.originalName);
        } else {
            res.status(404).json({ message: 'File not found on server' });
        }

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get Audit Logs (For a specific document, Owner only)
exports.getDocumentLogs = async (req, res) => {
    try {
        const doc = await Document.findById(req.params.id);
        if (!doc) return res.status(404).json({ message: 'Document not found' });

        if (doc.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const logs = await AuditLog.find({ document: req.params.id })
            .populate('viewer', 'name')
            .sort({ timestamp: -1 });

        res.json(logs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
