const mongoose = require("mongoose");

const connectwithDB = () => {
  try {
    mongoose.connect(process.env.DB_URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log("DB is connected successfully")
  } catch (error) {
      console.log(error)
      console.log("Something went wrong with")
  }
};

module.exports = connectwithDB;
