const express = require("express");
const app = express();
var cors = require('cors')
var morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fileupload = require("express-fileupload");

// Swagger ui documentation
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

app.use(cors())
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// temp middleware of image upload testing
app.set("view engine", "ejs");

// regular middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cookies and files middleware
app.use(cookieParser());
app.use(fileupload({
    useTempFiles:true,
    tempFileDir:"/temp/"
}));

// simple morgan middleware
app.use(morgan("tiny"));



// ---------------------------------------------------route-section---------------------------------------------------
// importing all the routes from route folder

const home = require("./routes/home");
const user = require("./routes/user");
const product = require("./routes/product");
const payment = require("./routes/payment");
const order = require("./routes/order");

// router middleware

app.use("/api/v1/", home);
app.use("/api/v1/", user);
app.use("/api/v1/", product);
app.use("/api/v1/", payment);
app.use("/api/v1/", order);
app.get('/signuptest',(req,res)=>{
    res.render('uploadtest');
})
app.get('/',(req, res)=>{
    res.render('home')
})
module.exports = app;
