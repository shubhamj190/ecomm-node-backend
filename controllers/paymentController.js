const nanoid = require("nanoid");

const stripe = require("stripe")(process.env.STRIPE_SECRET);
exports.sendStripeKeys = async (req, res, next) => {
  try {
    res.status(200).json({
      scuccess: true,
      stripe_key: "This is a dummy key",
    });
  } catch (error) {
    console.log(error);
  }
};

exports.captureStripePayment = async (req, res, next) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: "inr",
      automatic_payment_methods: { enabled: true },

      // optional

      metadata: { integreation_check: "accept_a_payment" },
    });

    res.status(200).json({
      scuccess: true,
      client_secret: paymentIntent.client_secret,
      amount: req.body.amount,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.sendRazorpayKeys = async (req, res, next) => {
  try {
    res.status(200).json({
      scuccess: true,
      stripe_key: "This is a dummy key",
    });
  } catch (error) {
    console.log(error);
  }
};

exports.captureRazorpayPayment = async (req, res, next) => {
  try {
    var instance = new Razorpay({
      key_id: process.env.RAZORPAY_API_KEY,
      key_secret: RAZORPAY_SECRET,
    });

    instance.orders.create({
      amount: req.body.amount,
      currency: "INR",
      receipt: nanoid(10),
    });
    const myOrder = await instance.order.create(options);

    res.status(200).json({
      scuccess: true,
      myOrder,
      amount: req.body.amount,
    });
  } catch (error) {
    console.log(error);
  }
};
