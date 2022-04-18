const utils = require("../helpers/utils");

const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

module.exports.registerValidation = async (req, res, next) => {
  const errors = {
    username: [],
    email: [],
    password: [],
    general: []
  }

  // validating username
  if(!req.body.username || req.body.username == '') {
    errors.username.push("Username is required")
  } else {
    // if username length is less than 4
    if(req.body.username.trim().length < 4) {
      errors.username.push("Username length should be at least 4 character long.")
    }

    // if username length is greter than 20
    if(req.body.username.trim().length > 20) {
      errors.username.push("Username length should not be more than 20 character long.")
    }
  }

  // validating email address
  if(!req.body.email || req.body.email == '') {
    errors.email.push("Email is required")
  } else {

    // if email is invalid
    if(!emailRegex.test(req.body.email)) {
      errors.email.push("Email is invalid")
    }
  }

  // validating password
  if(!req.body.password || req.body.password == '') {
    errors.password.push("Password is required")
  } else {
    // does password contains small letter or not
    if(!/[a-z]/.test(req.body.password.trim())) {
      errors.password.push("Password should contain at least one small latter.");
    } 

    // does password contains capital letter or not
    if(!/[A-Z]/.test(req.body.password.trim())) {
      errors.password.push("Password should contain at least one capital latter.");
    }

    // if password length is less than 6
    if(req.body.password.trim().length < 6) {
      errors.password.push("Password length should be at least 6 character long.")
    }

    // if password length is greter than 14
    if(req.body.password.trim().length > 14) {
      errors.password.push("Password length should not be more than 14 character long.")
    }
  }

  if(errors.username.length > 0 || errors.email.length > 0 || errors.password.length > 0) {
    return res.status(403).json({
      success:false,
      errors: errors
    })
  } else {
    next()
  }

}
