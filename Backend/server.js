const http = require("http");
const express = require('express');
const cors = require('cors')
const bodyParser = require("body-parser");

const path = require("path");
// const multer = require("multer");
// const fs = require('fs');

///long

const app = express();
const server = http.createServer(app);
const port = 9100;




// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

// app.use('/upload', express.static('./uploads'));

// const routes = require('./route/routes'); // นำเข้า routes ไว้ข้างบน

const productRoutes = require('./route/product_route');
const billRoutes = require('./route/bill_route');
const userRoutes = require('./route/user_route');
const return_bill_Routes = require('./route/return_bill_route');

// app.use(routes); // ใช้งาน routes หลังจากนำเข้า
app.use(productRoutes);
app.use(billRoutes);
app.use(userRoutes);
app.use(return_bill_Routes);


app.use(cors({
  origin: 'https://localhost:4200', // กำหนดโดเมนที่อนุญาตให้เข้าถึง
  methods: 'GET, PUT, POST, DELETE, HEAD, OPTIONS, PATCH', // กำหนดวิธีการที่อนุญาต
  credentials : true, // กำหนดให้ส่งค่า cookies และ headers อื่น ๆ ไปพร้อมกันกับคำขอ
}));

/*
// เรียก path ได้เฉพาะ 4200
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
  next();
});
*/





// Server listening
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
