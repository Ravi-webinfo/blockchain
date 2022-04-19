require('dotenv').config();
const express = require("express");
require("./config/db");
const cors = require("cors");
const passport = require('passport');
const FileUpload = require('express-fileupload')
const path = require('path')

const app = new express();


// Global middleware.
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(cors());
app.use(FileUpload());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
require('./config/passport')(passport);

// aquiring all routes.
app.use("/user", require('./routes/UserRoute'));
app.use("/role", require('./routes/RoleRoute'));
app.use("/wallet", require('./routes/WalletRoute'));
app.use("/nfts", require('./routes/NFTsRoute'));


app.get('/', passport.authenticate('jwt', {session: false, failureRedirect: '/unauthorized'}), (req, res) => {
  return res.status(200).json({success:true, message: 'User authorized successfully.', user: {
    username: req.user.username,
    email: req.user.email,
    role: {
      name: req.user.role.name,
      slug: req.user.role.slug
    },
    profile_pic: req.user.profile_pic
  }});
})

app.get('/unauthorized', (req, res) => {
  return res.status(401).json({success:false, message: 'User Unauthorized'});
})

app.listen(3001, function () {
  console.log("server is running on port:3001");
});
