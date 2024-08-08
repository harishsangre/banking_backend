const Account = require('../models/accountModel');
const Transaction = require('../models/transactionModel');
const { validateTransaction, validateTransfer } = require('../utils/validate');
const { authenticateToken } = require('../utils/auth');
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken');

exports.createAccount =  async (req, res) => {
    const { name, initialAmount,email,password } = req.body;
    try {
        const existingAccount = await Account.findOne({ email });
        if (existingAccount) {
            return res.status(400).json({ error: 'Email already exists' });
        }
        const account = new Account({ name, balance: initialAmount,email,password });
        await account.save();
        res.status(201).json(account);
    } catch (err) { 
        console.log(err)
        res.status(500).json({ error: err.message });
    } 
};

exports.deposit = [authenticateToken, validateTransaction, async (req, res) => {
    const { amount,accountNumber } = req.body;
    try {
        const account = await Account.findOne({accountNumber });
        if (!account) return res.status(404).json({ error: 'Account not found' });
        const accountbalance = Number(account.balance)
        const depositamount = Number(amount)
        account.balance = accountbalance + depositamount
        await account.save();

        const transaction = new Transaction({
            type: 'deposit',
            amount,
            fromAccount: account._id
        });
        await transaction.save();

        res.json({message:`Amount ${amount} deposited successfull, available balance ${account.balance}`});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}];

exports.withdraw = [authenticateToken, validateTransaction, async (req, res) => {
    const { amount,accountNumber } = req.body;
    try {
        const account = await Account.findOne({accountNumber});
        if (!account) return res.status(404).json({ error: 'Account not found' });
        if (account.balance < amount) return res.status(400).json({ error: 'Insufficient funds' });

        account.balance -= amount;
        await account.save();

        const transaction = new Transaction({
            type: 'withdrawal',
            amount,
            fromAccount: account._id
        });
        await transaction.save();

        res.json({message:`Amount ${amount} withdraw successfull, available balance ${account.balance}`});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}];

exports.transfer = [authenticateToken, validateTransfer, async (req, res) => {
    const { amount, toAccountNumber } = req.body;
    const fromAccountNumber = req.user.accountNumber;

    try {
        const fromAccount = await Account.findOne({ accountNumber: fromAccountNumber });
        const toAccount = await Account.findOne({ accountNumber: toAccountNumber });

        if (!fromAccount || !toAccount) return res.status(404).json({ error: 'Account not found' });

        const amountToTransfer = Number(amount);
        const fromAccountBalance = Number(fromAccount.balance);
        const toAccountBalance = Number(toAccount.balance);

        if (fromAccountBalance < amountToTransfer) return res.status(400).json({ error: 'Insufficient funds' });

        fromAccount.balance = fromAccountBalance - amountToTransfer;
        toAccount.balance = toAccountBalance + amountToTransfer;

        await fromAccount.save();
        await toAccount.save();

        // Record the transaction
        const transaction = new Transaction({
            type: 'transfer',
            amount: amountToTransfer,
            fromAccount: fromAccount._id,
            toAccount: toAccount._id
        });
        await transaction.save();

        res.json({ message: 'Amount transferred successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}];

exports.getAccountDetails = async (req, res) => {
    try {
        const account = await Account.findById(req.query.id);
        if (!account) return res.status(404).json({ error: 'Account not found' });
        res.json(account);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteAccount = async (req, res) => {
    const accountId = req.query.id; 
    try {
        const result = await Account.findByIdAndUpdate(
            accountId,
            { deleted: true }, 
            { new: true } 
        );
        if (!result) {
            return res.status(404).json({ error: 'Account not found' });
        }
        res.status(200).json({ message: 'Account marked as deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getTransactionHistory = async (req, res) => {
    try {
        const transactions = await Transaction.find({ fromAccount: req.query.id });
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.login=async (req, res) => {
    const { email, password } = req.body;
    const user = await Account.findOne({ email });
    if (!user) {
        return res.status(400).json({ error: 'Invalid email or password' });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        return res.status(400).json({ error: 'Invalid email or password' });
    }
    const token = jwt.sign({ _id: user._id,accountNumber: user.accountNumber }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Logged in successfully', token });
};