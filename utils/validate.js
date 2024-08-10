const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
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
    body('amount').isNumeric().isFloat({ gt: 0 }).withMessage('Amount must greater than Zero'),
    // body('accountNumber').isString().withMessage('Account number must be a string').isLength({ min: 10, max: 20 }).withMessage('Account number must be between 10 and 20 characters').matches(/^ACCT-[a-zA-Z0-9]{8,10}-[a-zA-Z0-9]{6,8}$/).withMessage('Account number format is invalid'),
    (req, res, next) => {
        const hasAccountNumber = req.body.accountNumber;
        if (!hasAccountNumber) {
            // If accountNumber is missing, extract it from the token
            const token = req.headers.authorization?.split(' ')[1];
            if (token) {
                try {
                    // Decode token (assuming you have a function for decoding)
                    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
                    req.body.accountNumber = decodedToken.accountNumber;
                    console.log(decodedToken.accountNumber,decodedToken.accountNumber)
                } catch (error) {
                    console.log(error)
                    return res.status(401).json({ errors: [{ msg: 'Invalid token' }] });
                }
            }
        }


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
