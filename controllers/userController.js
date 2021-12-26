const User = require("../models/user");
const cookieToken = require("../utils/cookieToken");
const customError = require("../utils/customError");
const fileupload = require("express-fileupload");
const clodinary = require("cloudinary");
const sendEmail = require("../utils/emailHelper");
const { findById } = require("../models/user");

exports.signup = async (req, res, next) => {
  try {
    // checking if fields is in not null
    const { name, email, password } = req.body;

    if (!(email || name || password)) {
      return next(new customError("name, email, password are required", 400));
    }
    // handling files

    if (!req.files) {
      return next(new customError("photo should not be empty"));
    }

    let result;

    if (req.files) {
      let file = req.files.photo;
      result = await clodinary.v2.uploader.upload(file.tempFilePath, {
        folder: "ecommapp",
        width: 150,
        crop: "scale",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      photo: { id: result.public_id, secure_url: result.secure_url },
    });

    cookieToken(user, res);
  } catch (error) {
    console.log(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!(email || password)) {
      return next(
        new customError("please provide and email and password", 400)
      );
    }
    // here we are using selct keyword because in models we delibreatly said that password select as false
    const user = await User.findOne({ email }).select("+password");
    console.log(user);

    if (!user) {
      return next(new customError("Email or password is not correct1", 400));
    }
    // matching the password
    const isCorrectPassword = await user.IsValdatedPassword(password);

    if (!isCorrectPassword) {
      return next(new customError("email and password is incorrect", 400));
    }

    cookieToken(user, res);
  } catch (error) {
    console.log(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.log(error);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    // check user exists or not
    const user = await User.findOne({ email });

    if (!user) {
      return next(new customError("Email not found as registers", 400));
    }

    const forgotToken = await user.forgotpwdToken();
    console.log("forgot password token", forgotToken);

    await user.save({ validateBeforSave: true });

    const myurl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/password/reset/${forgotToken}`;
    console.log("forgot password url", myurl);

    const message = `copy paste this ${myurl} and hit enter\n\n ${myurl}`;

    try {
      await sendEmail({
        email: email,
        subject: "Reset your password",
        message,
      });

      res
        .status(200)
        .json({ success: true, message: "email sent succesfully" });
    } catch (error) {
      user.forgotPasswordToken = undefined;
      user.forgotPasswordExpiry = undefined;
      await user.save({ validateBeforSave: true });

      return next(new customError(error.message, 500));
    }
  } catch (error) {
    console.log(error);
  }
};

exports.passwordReset = async (req, res, next) => {
  try {
    const token = req.params.token;

    const user = await User.findOne({
      token,
      forgotPasswordExpiry: { $gt: Date.now() },
    });

    // if not user
    if (!user) {
      return next(new customError("Invalid token", 400));
    }

    // password checking
    if (req.body.password != req.body.confirmPassword) {
      return next(
        new customError("password and confrim password does not matxh", 400)
      );
    }

    user.password = req.body.password;
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;

    await user.save();

    // send a json response or token

    cookieToken(user, res);
  } catch (error) {
    console.log(error.message);
  }
};
exports.getLoggedUserDetails = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error.message);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const userid = req.user.id;

    const user = await User.findById(userid).select("+password");

    const isCorrectOldPassword = await user.IsValdatedPassword(
      req.body.oldPassword
    );

    if (!isCorrectOldPassword) {
      return next(new customError("Old password is incorrect", 400));
    }

    user.password = req.body.newPassword;
    await user.save();

    cookieToken(user, res);
  } catch (error) {
    console.log(error);
  }
};
exports.updateUserDetails = async (req, res, next) => {
  try {
    const userid = req.user.id;

    if (!(req.body.name || req.body.email)) {
      return next(new customError("updation cannot blanked", 400));
    }

    const newDate = {
      name: req.body.name,
      email: req.body.email,
    };

    if (req.files) {
      const user = await User.findById(user.id);
      const imageId = await user.photo.id;
      const resp = await clodinary.v2.uploader.destroy(imageId);

      const result = await clodinary.v2.uploader.upload(
        req.files.photo.tempFilePath,
        {
          folder: "ecommapp",
          width: 150,
          crop: "scale",
        }
      );

      newDate.photo = {
        id: result.id,
        secure_url: result.secure_url,
      };
    }

    const user = await User.findByIdAndUpdate(userid, newDate, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(200).json({
      sucess: true,
    });

    cookieToken(user, res);
  } catch (error) {
    console.log(error);
  }
};
exports.adminGetOneUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(new customError("user not found", 400));
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
  }
};
exports.adminAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    res.status(200).json({
      users,
    });
  } catch (error) {
    console.log(error);
  }
};
exports.adminUpdateoneUsers = async (req, res, next) => {
  try {
    const newDate = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
    };

    const user = await User.findByIdAndUpdate(req.params.id, newDate, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(200).json({
      sucess: true,
    });
  } catch (error) {
    console.log(error);
  }
};
exports.adminDeleteoneUsers = async (req, res, next) => {
  try {
    const userid = req.params.id;
    const user = await User.findById(userid);

    if (!user) {
      return next(new customError("no user found", 400));
    }

    const imageId = user.photo.id;

    await clodinary.v2.uploader.destroy(imageId);

    await user.remove();

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
exports.managerAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ role: "user" });

    res.status(200).json({
      users,
    });
  } catch (error) {
    console.log(error);
  }
};
