const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: true,
  },
  lname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  mobile: {
    type: Number,
    required: true,
    unique: true,
  },
  gender: {
    type: String,
    required: true,
  },
  dob: {
    type: String,
  },
  logo: {
    type: String,
  },
  resetPasswordToken: {
    type: Number,
  },
  resetPasswordExpires: {
    type: Date,
  },
  address: [
    {
      street: { type: String },
      pincode: { type: Number },
      city: { type: String },
      state: { type: String },
      country: { type: String },
    },
  ],
  isVerified: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    default: "user",
  },
});

module.exports = mongoose.model("userData", userSchema);
