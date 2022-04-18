const mongoose = require("mongoose");

const user_accountsSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  hash: {
    type: String,
    required: true,
  },
  salt: {
    type: String,
    required: true,
  },
  profile_pic: {
    type: String,
    required: false
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'role',
    required: true
  }
}, { timestamps: true });

module.exports.user_accounts = mongoose.model(
  "user_account",
  user_accountsSchema
);

/**
 * Email validation before insertion.
 */
user_accountsSchema.path("email").validate(function (email) {
  var emailRegex =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  return !emailRegex.test(email.text); // Assuming email has a text attribute
}, "Invalid email.");
