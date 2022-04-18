const Router = require('express').Router()
const passport = require('passport')
const {user_wallet} = require('../models/user_wallet')
const {walletMiddleware} = require('../middlewares/WalletMiddleware')


Router.post('/', 
    passport.authenticate('jwt', {session:false, failureRedirect: '/unauthorized'}),
    walletMiddleware,
    (req, res) => {
        user_wallet.findOne({
            $and: [
                {user_id: req.user.id},
                {account_hash: req.body.address}
            ]
        }, function(err, data) {
            if(err) {
                if (
                    err["keyPattern"].account_hash != "undefined" &&
                    err["keyPattern"].account_hash
                ) {
                    return res.status(200).json({success:true, message: "Wallet has been tracked successfully."});
                } else {
                    return res.status(403).json({success:false, message: err.message});
                }
            }
            if(data === null) {
                user_wallet.create({user_id: req.user._id, account_hash: req.body.address, balance: req.body.balance})
                .then(function(wallet) {
                    return res.status(201).json({success: true, message: "Wallet registered Successfully."})
                }).catch(function(error) {
                    return res.status(403).json({success:false, message: error.message})
                })
            } else {
                return res.status(200).json({success:true, message: "Wallet has been tracked successfully."});
            }
        })
})



module.exports = Router