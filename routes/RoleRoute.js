const Router = require('express').Router();
const {roles} = require('../models/role');
const {roleCreate} = require('../middlewares/RoleMiddleware');
const passport = require('passport')

Router.post('/', passport.authenticate('jwt', {session: false, failureRedirect: '/unauthorized'}), roleCreate, (req, res) => {
    const errors = {
        name: [],
        slug: [],
        general: []
    }
    if(!req.body.name || req.body.name == '') {
        errors.name.push("Role name is required.");
    }
    if(!req.body.slug || req.body.slug == '') {
        errors.slug.push("Role slug is required.");
    } 
    if(errors.name.length > 0 || errors.slug.length > 0) {
        return res.status(403).json({success:false, errors: errors});
    }
    else {
        const role = {
            name: req.body.name,
            slug: req.body.slug
        }
        roles.create(role, function(err, data) {
            if(err) throw err;
            else {
                return res.status(201).json({success: true, message: "New role has been created.", role: data});
            }
        })
    }
});

module.exports = Router