const User = require("../models/user");
const cookieToken = require("../utils/cookieToken");
const customError = require("../utils/customError");
const fileupload = require("express-fileupload");
const clodinary = require("cloudinary");
const sendEmail = require("../utils/emailHelper");
const Product = require("../models/product");
const WhereClause = require("../utils/whereClause");

exports.addProduct = async (req, res, next) => {
  try {
    let imageArr = [];

    if (!req.files) {
      return next(new customError("Images are required", 401));
    }

    if (req.files) {
      for (let index = 0; index < req.files.photos.length; index++) {
        let result = await clodinary.v2.uploader.upload(
          req.files.photos[index].tempFilePath,
          {
            folder: "products",
          }
        );

        imageArr.push({
          id: result.public_id,
          secure_url: result.secure_url,
        });
      }
    }

    req.body.photos = imageArr;
    req.body.user = req.user.id;

    const product = await Product.create(req.body);

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getAllProduct = async (req, res, next) => {
  try {
    const resultPerPage = 6;
    const totalcountProduct = await Product.countDocuments();

    const productsObj = new WhereClause(Product.find(), req.query)
      .search()
      .filter();

    let products = await productsObj.base;
    const filteredProductNumber = products.length;

    //products.limit().skip()

    productsObj.pager(resultPerPage);
    products = await productsObj.base.clone();

    res.status(200).json({
      success: true,
      products,
      filteredProductNumber,
      totalcountProduct,
    });
    console.log(products);
  } catch (error) {
    console.log(error);
  }
};

exports.adminGetAllProduct = async (req, res, next) => {
  try {
    const products = await Product.find();

    if (!products) {
      return next(new customError("no products added "));
    }

    res.status(200).json({
      products,
      sucess: true,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getSingleproduct = async (req, res) => {
  try {
    const product = await Product.find({ _id: req.params.id });

    if (!product) {
      return next(new customError("404, page or product not found "));
    }

    res.status(200).json({
      product,
      sucess: true,
    });
  } catch (error) {
    console.log(error);
  }
};
exports.adminUpdateOneProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return next(new customError("404, page or product not found "));
    }

    let imageArr = [];
    if (req.files) {
      // destory the exesting images
      for (let index = 0; index < product.photos.length; index++) {
        await clodinary.v2.uploader.destroy(product.photos[index].id);
      }

      for (let index = 0; index < req.files.photos.length; index++) {
        let result = await clodinary.v2.uploader.upload(
          req.files.photos[index].tempFilePath,
          {
            folder: "products",
          }
        );
        imageArr.push({
          id: result.public_id,
          secure_url: result.secure_url,
        });
      }
    }

    req.body.photos = imageArr;

    console.log(req.body);
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.log(error);
  }
};
exports.adminDeleteOneProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);
    console.log(product);

    if (!product) {
      return next(new customError("404, page or product not found "));
    }

    let imageArr = [];

    // destory the exesting images
    for (let index = 0; index < product.photos.length; index++) {
      await clodinary.v2.uploader.destroy(product.photos[index].id);
    }

    await product.remove();
    res.status(200).json({
      succes: true,
      message: "product was deleted successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

exports.addReview = async (req, res, next) => {
  try {
    const { rating, comment, productId } = req.body;

    const review = {
      user: req.user._id,
      rating: Number(rating),
      comment,
      productId,
    };

    const product = await Product.findById(productId);

    const Alreadyreviewd = product.reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString()
    );

    if (Alreadyreviewd) {
      product.reviews.forEach((review) => {
        if (review.user.toString() === req.user._id.toString()) {
          review.comment = comment;
          review.rating = rating;
        }
      });
    } else {
      product.review.push(review);
      product.numberOfreviews = product.numberOfreviews.length;
    }

    // adjust rating
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.revies.length;

    await product.save({ validateBdforSave: false });

    res.status(200).json({
      success: true,
      message: "rating aded successfully!!",
    });
  } catch (error) {
    console.log(error);
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    const { productId } = req.query;

    const product = await Product.findById(productId);

    const reviews = product.reviews.filter(
      (rev) => rev.user.toString() === req.user._id.toString()
    );

    const numberOfreviews = reviees.length;

    // adjust rating
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.revies.length;

    // update the product

    await Product.findByIdAndUpdate(
      productId,
      {
        reviews,
        ratings,
        numberOfreviews,
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );

    res.status(200).json({
      success: true,
      message: "rating aded successfully!!",
    });
  } catch (error) {
      console.log(error)
  }
};

exports.getOnlyReviewsOfOneProduct =async (req, res, next)=>{
    try {
        const {productId} = req.query.id;

        const product= Product.findById(productId)

        res.status(200).json({
            success:true,
            reviews:product.reviews
        })

    } catch (error) {
        console.log(error)
    }
}

exports.testProduct = (req, res) => {
  try {
    const query = req.query;
    console.log(query);
    res.status(200).json({
      success: true,
      greeting: "hello from product API",
    });
  } catch (error) {
    console.log("this is a error");
  }
};
