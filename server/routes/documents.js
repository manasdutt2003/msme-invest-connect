const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role'); // if needed
const documentController = require('../controllers/documentController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Setup Multer Storage for Vault
const vaultDir = 'uploads/vault';
if (!fs.existsSync(vaultDir)) {
    fs.mkdirSync(vaultDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, vaultDir)
    },
    filename: function (req, file, cb) {
        // Unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Routes
// POST /api/documents/upload - Upload a file (MSME only ideally, but let's check in controller or here)
router.post('/upload', auth, upload.single('file'), documentController.uploadDocument);

// GET /api/documents - List my docs or shared docs
router.get('/', auth, documentController.getDocuments);

// POST /api/documents/share - Share a document
router.post('/share', auth, documentController.shareDocument);

// GET /api/documents/:id/download - Download file
router.get('/:id/download', auth, documentController.downloadDocument);

// GET /api/documents/:id/logs - Get audit logs (Owner only)
router.get('/:id/logs', auth, documentController.getDocumentLogs);

module.exports = router;
