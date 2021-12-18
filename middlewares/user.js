const { TokenExpiredError } = require("jsonwebtoken");
const User = require("../models/user");
const customError = require("../utils/customError");
const jwt = require("jsonwebtoken");
const { findByIdAndUpdate } = require("../models/user");

exports.isLoggedIn = async (req, res, next) => {
  try {
    const token =
      req.cookies.token || req.header("Authorization").replace("Bearer ", "");

    if (!token) {
      return next(new CustomError("login first to access this page", 401));
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decodedToken.id);

    next();
  } catch (error) {
    console.log("This is a console log in logged in middleware");
    console.log(error);
  }
};

exports.customRole = (...roles)=>{
    try {
        return(req,res,next)=>{
            if (!roles.includes(req.user.role)) {
                return next(new customError("you are not allowed to view this", 400));
            }
            next()
        }
    } catch (error) {
        console.log(error)
    }
}