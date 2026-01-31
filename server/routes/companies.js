const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getAllCompanies, getMyCompany, createCompany } = require('../controllers/companyController');
const { validate, schemas } = require('../middleware/validation');

// @route   GET api/companies
// @desc    Get all companies
// @access  Public
router.get('/', getAllCompanies);

// @route   GET api/companies/my-company
// @desc    Get current user's company
// @access  Private
router.get('/my-company', auth, getMyCompany);

// @route   POST api/companies
// @desc    Create a company profile
// @access  Private
router.post('/', [auth, validate(schemas.createCompany)], createCompany);

module.exports = router;
