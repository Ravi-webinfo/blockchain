module.exports.loginValidation = (req, res, next) => {
  const errors = {
    username: [],
    password: [],
    general: []
  }
  if(!req.query.username || req.query.username == '') {
    errors.username.push('Username is required');
  } else {
    if(req.query.username.trim().length < 4) {
      errors.username.push("Username length should be at least 4 character long.")
    }
    if(req.query.username.trim().length > 20) {
      errors.username.push("Username length should not be more than 20 character long.")
    }
  }
  if(!req.query.password || req.query.password == '')
  {
    errors.password.push("Password is required.")
  } else {
    if(!/[a-z]/.test(req.query.password.trim())) {
      errors.password.push("Password should contain at least one small latter.");
    } 
    if(!/[A-Z]/.test(req.query.password.trim())) {
      errors.password.push("Password should contain at least one capital latter.");
    }
    if(req.query.password.trim().length < 6) {
      errors.password.push("Password length should be at least 6 character long.")
    }
    if(req.query.password.trim().length > 14) {
      errors.password.push("Password length should not be more than 14 character long.")
    }
  }
  if(errors.username.length > 0 || errors.password.length > 0) {
    return res.status(403).json({
      success:false,
      errors: errors
    })
  } else {
    next()
  }
}