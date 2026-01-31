const User = require('../models/User');
const multer = require('multer');
const path = require('path');

// Configure Multer for file storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // In a real app, ensure this directory exists or use cloud storage (S3/Cloudinary)
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, and PDF are allowed.'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: fileFilter
});

exports.uploadMiddleware = upload.single('document');

exports.uploadDocument = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const { docType } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.kycDocuments.push({
            docType: docType || 'other',
            filename: req.file.filename
        });

        user.verificationStatus = 'pending';
        await user.save();

        // Simulate Mock Verification Process
        setTimeout(async () => {
            try {
                // Fetch fresh user instance
                const userToVerify = await User.findById(user._id);
                // Randomly approve (for demo purposes, let's say 80% success)
                // For this specific walkthrough, we'll force success to show the verified badge
                userToVerify.verificationStatus = 'verified';
                await userToVerify.save();
                console.log(`User ${userToVerify.email} verification auto-completed.`);
            } catch (err) {
                console.error("Mock verification failed", err);
            }
        }, 5000); // 5 seconds delay

        res.status(200).json({
            message: 'Document uploaded successfully. Verification in progress.',
            status: user.verificationStatus
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during upload' });
    }
};

exports.getVerificationStatus = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('verificationStatus kycDocuments');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
