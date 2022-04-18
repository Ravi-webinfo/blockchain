const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const { user_accounts } = require('../models/user_account');
const path = require('path')
const fs = require('fs')

const pathToKey = path.join(__dirname, '..','id_rsa_pub.pem')
const PUB_KEY = fs.readFileSync(pathToKey, 'utf-8')

const options = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: PUB_KEY,
	algorithms: ['RS256']
}

const verifyCallback = (jwt_payload, done) => {
	user_accounts.findOne({_id:jwt_payload.sub}).populate('role', 'name slug').then((user) => {
		if (!user) { return done(null, false) }
		else { return done(null, user) }
	}).catch((err) => {
		return done(err, false)
	})
}

const Strategy = new JwtStrategy(options, verifyCallback)

module.exports = (passport) => {
	passport.use(Strategy)
}