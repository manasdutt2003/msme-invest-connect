const express = require('express');
const router = express.Router();
const { register, login, refresh, logout } = require('../controllers/authController');
const { validate, schemas } = require('../middleware/validation');

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', validate(schemas.register), register);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', validate(schemas.login), login);

// @route   GET api/auth/refresh
// @desc    Refresh access token
// @access  Public (Validated by Cookie)
router.get('/refresh', refresh);

// @route   POST api/auth/logout
// @desc    Logout user (Clear cookie)
// @access  Public
router.post('/logout', logout);

module.exports = router;
