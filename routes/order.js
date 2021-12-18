const express = require("express");
const router = express.Router();

const {
  createOrder,
  getOneOrder,
  getLoggedinUser,
  adminGetAllOrders,
  adminDeleteSingleOrders,
} = require("../controllers/orderController");
const { adminUpdateOneProduct } = require("../controllers/productControllers");

const { isLoggedIn, customRole } = require("../middlewares/user.js");

router.route("/order/create").post(isLoggedIn, createOrder);
router.route("/order/:id").get(isLoggedIn, getOneOrder);
router.route("/orders/myorders").get(isLoggedIn, getLoggedinUser);

// admin routes
router.route("/admin/orders/allorders").get(isLoggedIn, adminGetAllOrders);
router.route("/admin/orders/update/:id").put(isLoggedIn, adminUpdateOneProduct);
router
  .route("/admin/orders/delete/:id")
  .put(isLoggedIn, adminDeleteSingleOrders);

module.exports = router;
