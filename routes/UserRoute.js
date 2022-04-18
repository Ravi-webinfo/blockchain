const Router = require("express").Router();
const utils = require("../helpers/utils");
const { user_accounts } = require("../models/user_account");
const { registerValidation } = require("../middlewares/RegisterMiddleware");
const { loginValidation } = require('../middlewares/LoginMiddleware');
const { roles } = require("../models/role");
const {user_track} = require('../models/user_track');

Router.get("/", loginValidation, (req, res) => {
  user_accounts.findOne({username: req.query.username.trim()}).populate('role', 'name slug').then((user) => {
    const errors = {
      username: [],
      password: [],
      general: []
    }
    if(!user) {
      errors.username.push("User is not registered.");
      return res.status(403).json({success:false, errors:errors, type: 'username'});
    } else {
      var isValid = utils.verifyPassword(req.query.password, user.salt, user.hash);
      if(!isValid) {
        errors.password.push("Password is Wrong.");
        return res.status(403).json({success:false, errors:errors, type: 'password'});
      } else {
        user_track.create({
          user_id: user._id, 
          device_info: req.headers["user-agent"], 
          ip_address: req.query.ip_address, 
          visit_time: new Date().toLocaleString('en-US', {timeZone: 'Asia/Kolkata'}),
          visit_type: 'login'
        }).then(function(track) {
          var jwt = utils.issueJWT(user);
          return res.status(200).json({
            success:true, 
            message: 'User Authorized successfully.', 
            user: {
              email:user.email.trim(), 
              username:user.username.trim(),
              role: {
                name: user.role.name,
                slug: user.role.slug
              },
              profile_pic: user.profile_pic
            }, 
            token:jwt.token, 
            track: track._id,
            expires:jwt.expires
          })
        }).catch(function(error) {
          errors.general.push(error.message);
          return res.status(403).json({success:false, errors:errors, type: 'user_track'});
        })
      }
    }
  })
});

Router.post("/", registerValidation , (req, res) => {
  const password = utils.hashPassword(req.body.password);
  const user = {
    username: req.body.username,
    email: req.body.email,
    hash: password.hash,
    salt: password.salt,
    role: ''
  };
  roles.findOne({slug: 'CUSTOMER'}, function(err, data) {
    const errors = {
      username: [],
      email: [],
      password: [],
      general: []
    }
    if(err) throw err;
    else {
      if(data) {
        user.role = data._id;
        user_accounts.create(user).then(function (data) {
          var jwt = utils.issueJWT(data)
          user_track.create({
            user_id: data._id,
            device_info: req.headers["user-agent"],
            ip_address: req.body.ip_address,
            visit_time: new Date().toLocaleString('en-US', {timeZone: 'Asia/Kolkata'}),
            visit_type: 'register'
          }).then(function(track) {
            return res.status(201).json({
              success:true, 
              message:'User registered successfully.',
              user: {
                username: data.username,
                email: data.email,
                role: {
                  name: 'Customer',
                  slug: 'CUSTOMER'
                },
                profile_pic: data.profile_pic
              },
              token:jwt.token,
              track: track._id,
              expires:jwt.expires
            })
          }).catch(function(error) {
            errors.general.push(error.message);
            return res.status(403).json({success:false, errors: errors, type:'user_track'});
          })
        }).catch(function(err) {
          if(err) {
            if (
              err["keyPattern"].username != "undefined" &&
              err["keyPattern"].username
            ) {
              errors.username.push("Username is already in use.");
            }
            if (
              err["keyPattern"].email != "undefined" &&
              err["keyPattern"].email
            ) {
              errors.email.push("Email is already in use.");
            }
            if(errors.username.length > 0 || errors.email.length > 0) {
              return res.status(403).json({success:false, errors: errors});
            } else {
              return res.status(405).json({ success: false, message: err.message, type: 'FROM_DB' });
            }
          }
        });
      } else {
        errors.general.push("New customer is allowed right now.");
        return res.status(403).json({success:false, errors:errors});
      }
    }
  })
});



module.exports = Router;
