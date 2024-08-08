const mongoose = require('mongoose');
const crypto = require('crypto');
const bcrypt = require('bcrypt'); 

const AccountSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    accountNumber: { type: String, unique: true },
    balance: { type: Number, required: true, min: 0 },
    deleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

AccountSchema.pre('save', async function (next) {
    if (!this.isModified('password') && !this.isNew) return next();
    try {
        if (this.isNew) {
            this.accountNumber = generateUniqueAccountNumber();
        }
        if (this.isModified('password')) {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
        }
        next();
    } catch (err) {
        next(err);
    }
});

function generateUniqueAccountNumber() {
    const timestamp = Date.now().toString(36);
    const randomPart = crypto.randomBytes(3).toString('hex');
    return `ACCT-${timestamp}-${randomPart.toUpperCase()}`;
}

AccountSchema.methods.isValidPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const Account = mongoose.model('Account', AccountSchema);

module.exports = Account;