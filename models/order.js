const mongoose = require("mongoose");

// shipping_info
// {phone_no, address, city, postal_code,country},
// user,
// payment {}
// taxAmount,
// shippingAMount,
// orderStatus,
// deliveredAt
// createdA
// ---------------------------t
// orderItems=[{}]
// name,quantity,photo[],price, product

const orderSchema = new mongoose.Schema({
  shippingInfo: {
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    phoneNo: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
  },
  user: {
    type: mongoose.Schema.Types.ObjectID,
    ref: "User",
  },
  orderItems: [
    {
      name: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      product: {
        type: mongoose.Schema.Types.ObjectID,
        ref: "Product",
        required: true,
      },
    },
  ],
  payment: {
    is: {
      type: String,
    },
  },
  taxAmount: {
    type: Number,
    required: true,
  },
  shippingAmount: {
    type: Number,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  orderStatus: {
    type: String,
    required: true,
    default: "processing",
  },
  deliveredAt: {
    type: Date,
  },
  createdAt: {
    type: String,
    default: Date.now(),
  },
});
module.exports = mongoose.model("Order", orderSchema);
