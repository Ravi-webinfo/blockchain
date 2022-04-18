module.exports.walletMiddleware = (req, res, next) => {
    const errors = {
        address: [],
        balance: []
    }
    if(!req.body.address && req.body.address !== '') {
        errors.address.push("Address is required.");
    }
    if(!req.body.balance && req.body.balance !== '') {
        errors.balance.push("Balance is required.");
    }
    if(errors.address.length > 0 || errors.balance.length > 0) {
        return res.status(403).json({success:false, errors: errors, type: 'user_wallet'});
    } else {
        next();
    }
}