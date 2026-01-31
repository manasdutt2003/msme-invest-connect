const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const checkRole = require('../middleware/role');
const { getMyInvestments, invest, updatePreferences, getRecommendations } = require('../controllers/investController');
const { validate, schemas } = require('../middleware/validation');

// @route   GET api/invest/my-investments
// @desc    Get current user's investments
// @access  Private
router.get('/my-investments', auth, getMyInvestments);

// @route   POST api/invest
// @desc    Make an investment
// @access  Private (Investor only)
router.post('/', [auth, checkRole(['investor']), validate(schemas.invest)], invest);

// @route   PUT api/invest/preferences
// @desc    Update investment preferences
// @access  Private
router.put('/preferences', auth, updatePreferences);

// @route   GET api/invest/recommendations
// @desc    Get AI-based recommendations
// @access  Private
router.get('/recommendations', auth, getRecommendations);

module.exports = router;
