const User = require("../models/user");
const Product = require("../models/product");
const Order = require("../models/order");
const customError = require("../utils/customError");

exports.createOrder = async (req, res, next) => {
  try {
    const {
      shippingInfo,
      orderItems,
      payment,
      taxAmount,
      shippingAmount,
      totalAmount,
    } = req.body;

    const order = await Order.create({
      shippingInfo,
      orderItems,
      payment,
      taxAmount,
      shippingAmount,
      totalAmount,
      user: req.user._id,
    });

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getOneOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email role"
    );

    if (!order) {
      return next(new customError("no order found with this ID", 400));
    }

    res.status(200).json({ order, success: true });
  } catch (error) {
    console.log(error);
  }
};

exports.getOneOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email role"
    );

    if (!order) {
      return next(new customError("no order found with this ID", 400));
    }

    res.status(200).json({ order, success: true });
  } catch (error) {
    console.log(error);
  }
};

exports.getLoggedinUser = async (req, res, next) => {
  try {
    const order = await Order.find({ user: req.user._id }).populate(
      "user",
      "name email role"
    );

    if (!order) {
      return next(new customError("no order found with this ID", 400));
    }

    res.status(200).json({ order, success: true });
  } catch (error) {
    console.log(error);
  }
};

exports.adminGetAllOrders = (req, res, next) => {
  try {
    const orders = Order.find();
    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.adminUpdateSingleOrders = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id);

    if ((order.orderStatus = "Delivered")) {
      return next(new customError("Order is already marked for deliver"));
    }

    order.orderStatus = req.body.orderStatus;

    order.orderItems.forEach(async (prod) => {
      await updateProductStock(
        (productId = prod.product),
        (quantity = prod.quantity)
      );
    });

    await order.save();
    res.status(200).json({
        success:true,
        orderstatus:order.orderStatus
    })
  } catch (error) {
    console.log(error);
  }
};
exports.adminDeleteSingleOrders = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id);

    if (!order) {
      return next(new customError("there no order with this id"));
    }

    await order.remove()

  } catch (error) {
    console.log(error);
  }
};

async function updateProductStock(quantity, productId) {
  const product = await Product.findById(productId);
  product.stock = product.stock - quantity;
  product.save({
    validateBeforeSave: false,
  });
}
