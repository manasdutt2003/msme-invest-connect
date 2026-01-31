const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const verificationController = require('../controllers/verificationController');

// Upload KYC Document
router.post('/upload', auth, verificationController.uploadMiddleware, verificationController.uploadDocument);

// Get Verification Status
router.get('/status', auth, verificationController.getVerificationStatus);

module.exports = router;
