// here will be using try catch instead og big promise.

const BigPromise = require("../middlewares/bigpromise");

exports.home = (req, res) => {
  try {
    res.status(200).json({
      success: true,
      greeting: "hello from API",
    });
  } catch (error) {
    console.log("this is a error");
  }
};
