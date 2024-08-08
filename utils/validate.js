const { body, validationResult } = require('express-validator');

const validateCreateAccount = [
    body('name').isString().notEmpty().withMessage('Name is required'),
    body('email').isString().notEmpty().withMessage('Email is required'),
    body('password').isString().notEmpty().withMessage('Password is required'),
    body('initialAmount').isNumeric().isFloat({ gte: 0 }).withMessage('Initial amount must be a positive number'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const validateTransaction = [
    body('amount').isNumeric().isFloat({ gt: 0 }).withMessage('Amount must be a positive number'),
    body('accountNumber').isString().withMessage('Account number must be a string').isLength({ min: 10, max: 20 }).withMessage('Account number must be between 10 and 20 characters').matches(/^ACCT-[a-zA-Z0-9]{8,10}-[a-zA-Z0-9]{6,8}$/).withMessage('Account number format is invalid'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const validateTransfer = [
    body('amount').isNumeric().isFloat({ gt: 0 }).withMessage('Amount must be a positive number'),
    body('toAccountNumber')
    .isString()
    .withMessage('Recipient account number must be a string')
    .isLength({ min: 15, max: 20 })
    .withMessage('Recipient account number must be between 15 and 20 characters')
    .matches(/^ACCT-[a-zA-Z0-9]{8,10}-[a-zA-Z0-9]{6,8}$/)
    .withMessage('Recipient account number format is invalid'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {
    validateCreateAccount,
    validateTransaction,
    validateTransfer
};
