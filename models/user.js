const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
    maxlength: [40, "Name should be under 40 characters"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    validate: [validator.isEmail, "Please enter an email in correct format"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide an password"],
    minlength: [5, "password should be atleast 5 chars"],
    select: false,
  },
  role: {
    type: String,
    default: "user",
  },
  photo: {
    id: {
      type: String,
      required: true,
    },
    secure_url: {
      type: String,
      required: true,
    },
  },

  forgotPasswordToken: String,
  forgotPasswordExpiry: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// encrypting the password before the save
userSchema.pre("save", async function (next) {
  if (!this.isModified('password')) {
    return next;
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// validate the pasword method
userSchema.methods.IsValdatedPassword = async function (userSendPassword) {
  return await bcrypt.compare(userSendPassword, this.password);
};
// create and return jwt token
userSchema.methods.getJwtToken = function () {
  return  jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};

// generate forgot password token
userSchema.methods.forgotpwdToken = async function () {
  // to generate a long string
  const forgotToken = crypto.randomBytes(20).toString("hex");

  this.forgotPasswordToken = forgotToken;

  // forgot password expiry
  this.forgotPasswordExpiry = Date.now() + 20 * 60 * 1000;

  return forgotToken;
};

module.exports = mongoose.model("User", userSchema);
