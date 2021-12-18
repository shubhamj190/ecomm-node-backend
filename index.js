
require('dotenv').config()
const port = process.env.PORT
const app = require('./app')
const connectwithDB = require('./config/db')
const cloudinary = require('cloudinary')


// connect with DB
connectwithDB()

// clodinary config goes here 
cloudinary.config({
  cloud_name: "shub",
  api_key: "243562743221418",
  api_secret: "golVoHfX5loM64_NRlR3TbmEg-U",
});


app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`)
})
