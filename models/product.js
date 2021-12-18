const mongoose = require("mongoose");

// name
// price
// description
// photo[]
// {id,secureurl}
// category
// ratings
// noOfReviews
// brand
// stock
// reviews
// {user, name, ratngs, comment}
// user_role
// createdAt

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please provide the product name"],
    trim: true,
    maxlength: [120, "product length cannot be more than 120 chars"],
  },
  price: {
    type: Number,
    required: [true, "please provide the product price"],
    trim: true,
    maxlength: [5, "product length cannot be more than 5 chars"],
  },
  description: {
    type: String,
    required: [true, "please provide the product description"],
    trim: true,
  },
  photos: [
    {
      id: {
        type: String,
        required: [true],
      },
      secure_url: {
        type: String,
        required: [true],
      },
    },
  ],
  category: {
    type: String,
    required: [true, "please provide the product category from"],
    enum: {
      values: ["short-sleeves", "long-sleeves", "hoodies"],
      message:
        "please slesct category from- short-sleeves, long-sleeves, hoodies",
    },
  },
  brand: {
    type: String,
    required: [true, "please provide the product brand"],
  },
  ratings: {
    type: Number,
    default: 0,
  },
  stock: {
    type: Number,
    required: [true,'please add a number in stock'],
  },
  numberOfreviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectID,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectID,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    defaulf: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);
