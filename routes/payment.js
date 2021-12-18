const express = require("express");
const router = express.Router();

const {captureStripePayment, sendStripeKeys, captureRazorpayPayment, sendRazorpayKeys} = require("../controllers/paymentController");

const {  isLoggedIn } = require('../middlewares/user.js')

router.route('/stripekey').get(isLoggedIn, sendStripeKeys)
router.route('/razorpaykey').get(isLoggedIn, sendRazorpayKeys)


router.route('/capturestripepayment').post(isLoggedIn, captureStripePayment)
router.route('/capturerazorpaypayment').post(isLoggedIn, captureRazorpayPayment)




module.exports = router;