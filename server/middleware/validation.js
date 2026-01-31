const Joi = require('joi');

const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

const schemas = {
    register: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        role: Joi.string().valid('investor', 'business').required()
    }),
    login: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    }),
    createCompany: Joi.object({
        businessName: Joi.string().required(),
        description: Joi.string().required(),
        sector: Joi.string().required(),
        fundingGoal: Joi.number().min(1).required(),
        returnsPercentage: Joi.number().min(0).max(100).required()
    }),
    invest: Joi.object({
        companyId: Joi.string().required(),
        amount: Joi.number().min(1).required()
    })
};

module.exports = { validate, schemas };
