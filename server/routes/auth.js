const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { validate, schemas } = require('../middleware/validation');

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', validate(schemas.register), register);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', validate(schemas.login), login);

module.exports = router;
