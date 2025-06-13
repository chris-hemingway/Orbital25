const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
      type: String,
      required: [true, 'Please provide a username'],
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 20
    },
  email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      trim: true,
      lowercase: true
    },
  password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6
    }
});

module.exports = mongoose.model("User", userSchema);
