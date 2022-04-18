const mongoose = require('mongoose')

const userWalletSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user_account'
    },
    account_hash: {
        type: String,
        required: true
    },
    balance: {
        type: String,
        unique: true,
        required: true
    }
}, { timestamps: true })

module.exports.user_wallet = mongoose.model('user_wallet', userWalletSchema);