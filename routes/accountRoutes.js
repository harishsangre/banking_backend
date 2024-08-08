const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const { validateCreateAccount } = require('../utils/validate');

router.post('/createaccounts',validateCreateAccount, accountController.createAccount);
router.get('/getaccounts', accountController.getAccountDetails);
router.delete('/deleteaccount', accountController.deleteAccount);
router.post('/accounts/deposit', accountController.deposit);
router.post('/accounts/withdraw', accountController.withdraw);
router.post('/accounts/transfer', accountController.transfer);
router.get('/transactionshistory', accountController.getTransactionHistory);
router.post('/login', accountController.login);

module.exports = router;
