require("dotenv").config();
const express = require("express");
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const auth = require("./middleware/auth");
const mongoose = require("mongoose");



const { MONGO_URI } = 'mongodb://127.0.0.1:27017/'

exports.connect = () => {
  // Connecting to the database
  mongoose
    .connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      
    })
    .then(() => {
      console.log("Successfully connected to database");
    })
    .catch((error) => {
      console.log("database connection failed. exiting now...");
      console.error(error);
      process.exit(1);
    });
    
};



// importing user context
const User = require("./controller/user/user_controller");

const app = express();

app.use(express.json());

// Logic goes here
app.get('/', (req, res) => {
    // ตั้งค่าหัวข้อตอบกลับและส่งข้อมูลกลับ
    res.status(200).send('Hello, World !');
});




module.exports = app;