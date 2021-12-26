const mongoose = require("mongoose");

const connectwithDB = () => {
  try {
    mongoose.connect('mongodb+srv://shubham:nokia300@cluster0.5wlnu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
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
