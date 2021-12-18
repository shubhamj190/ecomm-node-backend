const express = require("express");
const router = express.Router();

const {
  testProduct,
  addProduct,
  getAllProduct,
  adminGetAllProduct,
  getSingleproduct,
  adminUpdateOneProduct,
  adminDeleteOneProduct,
  addReview,
  deleteReview,
  getOnlyReviewsOfOneProduct
} = require("../controllers/productControllers");

const { customRole, isLoggedIn } = require('../middlewares/user.js')

router.route("/testproduct").get(testProduct);
router.route("/product/getallproducts").get(getAllProduct);
router.route("/product/getsingleproduct/:id").get(getSingleproduct);
router.route("/review").put(isLoggedIn,addReview);
router.route("/review").delete(isLoggedIn,deleteReview);
router.route("/reviews").get(getOnlyReviewsOfOneProduct);

// admin routes

router.route("/product/addproduct").post(isLoggedIn, customRole('admin'), addProduct);
router.route("/product/getadminallproducts").get(isLoggedIn, customRole('admin'), adminGetAllProduct);
router.route("/product/adminupdateoneproduct/:id").put(isLoggedIn, customRole('admin'), adminUpdateOneProduct);
router.route("/product/admindeleteoneproduct/:id").delete(isLoggedIn, customRole('admin'), adminDeleteOneProduct);

module.exports = router;
