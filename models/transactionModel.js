const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    type: { type: String, enum: ['deposit', 'withdrawal', 'transfer'], required: true },
    amount: { type: Number, required: true, min: 0 },
    fromAccount: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
    toAccount: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
    date: { type: Date, default: Date.now }
});

const Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports = Transaction;
