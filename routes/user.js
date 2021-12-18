const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  logout,
  forgotPassword,
  passwordReset,
  getLoggedUserDetails,
  changePassword,
  updateUserDetails,
  adminAllUsers,
  managerAllUsers,
  adminGetOneUser,
  adminUpdateoneUsers,
  adminDeleteoneUsers
} = require("../controllers/userController");
const { isLoggedIn, customRole } = require("../middlewares/user");

isLoggedIn;
router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/forgotpassword").post(forgotPassword);
router.route("/password/reset/:token").post(passwordReset);
router.route("/userdashboard").get(isLoggedIn, getLoggedUserDetails);
router.route("/password/update").post(isLoggedIn, changePassword);
router.route("/userdashboard/update").post(isLoggedIn, updateUserDetails);

// admin only routes
router.route("/admin/users").get(isLoggedIn, customRole('admin'), adminAllUsers);
router.route("/admin/users/:id").get(isLoggedIn, customRole('admin'), adminGetOneUser);
router.route("/admin/users/:id").put(isLoggedIn, customRole('admin'), adminUpdateoneUsers);
router.route("/admin/users/:id").delete(isLoggedIn, customRole('admin'), adminDeleteoneUsers);

// manager only routes
router.route("/manager/users").get(isLoggedIn, customRole('manager'), managerAllUsers);

module.exports = router;
