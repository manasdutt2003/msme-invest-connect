const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getMyInvestments, invest } = require('../controllers/investController');
const { validate, schemas } = require('../middleware/validation');

// @route   GET api/invest/my-investments
// @desc    Get current user's investments
// @access  Private
router.get('/my-investments', auth, getMyInvestments);

// @route   POST api/invest
// @desc    Make an investment
// @access  Private
router.post('/', [auth, validate(schemas.invest)], invest);

module.exports = router;
