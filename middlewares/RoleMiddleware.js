const {roles} = require('../models/role')
module.exports.roleCreate = (req, res, next) => {
    const errors = {
        name: [],
        slug: [],
        general: []
    }
    if(!req.user) {
        errors.general.push("Not allowed unauthorized user.");
    }
    if(req.user && req.user.role) {
        roles.findById(req.user.role, function(err, role) {
            if(err) throw err;
            else {
                if(role.slug !== 'SUPER_ADMIN') {
                    errors.general.push("You are not authorized to create roles.")
                }
            }
        })
    }
    if(errors.name.length > 0 || errors.slug.length > 0 || errors.general.length > 0) {
        return res.status(403).json({success: true, errors: errors});
    } else {
        return next();
    }
}