const { MongoClient } = require("mongodb");
const { ObjectId } = require('mongodb');
require("dotenv").config();

const express = require("express");
const app = express();
const bcrypt = require('bcrypt');
const cors = require('cors');
var bodyParser = require("body-parser");
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const fs = require('fs');

const jwt = require('jsonwebtoken');
const secretKey = 'borrow-product'
const nodemailer = require('nodemailer');
const multer = require('multer'); //uplode files

const uri = "mongodb://127.0.0.1:27017/";



app.use(cors({
  origin: 'https://localhost:4200', // กำหนดโดเมนที่อนุญาตให้เข้าถึง
  methods: 'GET, PUT, POST, DELETE, HEAD, OPTIONS, PATCH', // กำหนดวิธีการที่อนุญาต
  credentials: true, // กำหนดให้ส่งค่า cookies และ headers อื่น ๆ ไปพร้อมกันกับคำขอ
}));
app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
// app.use('/register', express.static('./uploads_register'));
// app.use('../../uploads_register', (req, res) => {
//     res.sendFile(path.join(__dirname, `./files${req.url}`));
// })



app.use('/uploads_register', express.static(path.join(__dirname, '../../uploads_register')));




// กำหนดการเก็บข้อมูลสำหรับ multer
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, path.join(__dirname, '../../uploads_register'));
  },
  filename: function (req, file, callback) {
    const extname = path.extname(file.originalname);
    const filename = `${Date.now()}${extname}`;
    callback(null, filename);
  }
});

// สร้างอินสแตนซ์ของ multer
const upload = multer({ storage: storage }).single('file');


//เรียกค่าข้อมูลผู้ใช้ทั้งหมด
// app.get('/user')
async function getUserAll(req, res) {
  const client = new MongoClient(uri);
  await client.connect();
  const object = await client.db('test').collection('users')
    .find({ Isuse: "1" }).limit(10000).toArray();
  await client.close();
  res.status(200).send(object);
}



async function showimg(req, res) {

  const filename = req.params.filename;

  if (filename) {
    res.sendFile(path.join(__dirname, '../../uploads_register', filename));


  } else {
    // กรณีที่ filename เป็น undefined หรือไม่ถูกส่งมาให้ผู้ใช้
    res.status(404).send('File not found');
  }
}






async function forgotPassword(req, res) {
  try {
    const object = req.body;
    const client = new MongoClient(uri);
    await client.connect();
    const old_email = await client.db('test').collection('users').findOne({ 'email': object.email });

    const secret = secretKey + old_email.password;
    console.log("179 >>>   ", old_email.password);
    const token = jwt.sign({ email: old_email.email, id: old_email._id }, secret, { expiresIn: '5m' });
    const link = `http://localhost:9100/user/reset-password/${old_email._id}/${token}`;

    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: '123@gmail',
        pass: '123'
      }
    });

    var mailOptions = {
      from: '123@gmail',
      to: '123@gmail', // Replace with the desired email address
      subject: 'Reset password!!!',
      text: link,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    console.log("181", link);

    // client.close();
    res.status(200).send(object);
  } catch (err) {
    console.log(err);
  }
}



async function resetPassword(req, res) {

  const { id, token } = req.params;
  console.log(req.params);
  const { ObjectId } = require('mongodb');
  const client = new MongoClient(uri);
  await client.connect();
  const old_email = await client.db('test').collection('users').findOne({ _id: ObjectId(id) });
  console.log("202", old_email);
  if (!old_email) {
    res.send("ไม่มีชื่อผู้ใช้นี้!!!");
  }
  const secret = secretKey + old_email.password;
  console.log("206", old_email.password);
  try {
    const verify = jwt.verify(token, secret);
    res.send("ตรวจสอบแล้ว!!!");
    // res.location('http://localhost:4200/login');
  } catch (err) {
    res.send("ยังไม่ได้ตรวจสอบ!!!");

  }

}

async function resetPassword(req, res) {

  const { id, token } = req.params;
  const { password } = req.body;
  console.log(req.params);
  const { ObjectId } = require('mongodb');
  const client = new MongoClient(uri);
  await client.connect();
  const old_email = await client.db('test').collection('users').findOne({ _id: ObjectId(id) });
  console.log("202", old_email);
  if (!old_email) {
    res.send("ไม่มีชื่อผู้ใช้นี้!!!");
  }
  // const secret = secretKey + old_email.password;
  // try {
  //   const verify = jwt.verify(token, secret);
  //   await client.db('test').collection('users').updateOne({ _id: ObjectId(id) },{
  //     "$set":{
  //       password: password
  //     }
  //   })
  //   res.send("ตรวจสอบเเล้ว...");
  // } catch (err) {
  //   res.send("ยังไม่ได้ตรวจสอบ!!!");

  // }

}











function generateToken(userId) {

  const payload = { userId }; // ข้อมูลที่คุณต้องการจะเก็บใน JWT
  const options = {
    expiresIn: '1m',  //ระยะเวลาของ token 1 วัน

  };



  return jwt.sign(payload, secretKey, options);


}




// ในส่วนของ authenticateToken และ loginUser
// fnc authenticateToken  app.get ('/user/token')
function authenticateToken(req, res, next) {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).send('ไม่มี TOKEN ⚠️');
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        // Token หมดอายุ
        res.status(403).send('TOKEN ของคุณหมดอายุ ⚠️');

      } else {
        // Token ไม่ถูกต้องหรือมีปัญหาอื่น ๆ
        res.status(403).send('TOKEN ของคุณไม่ถูกต้อง ⚠️');
      }
    } else {
      res.status(200).send('คุณมี TOKEN แล้ว ✅');
    }
  });



}

async function loginUser(req, res) {
  const object = req.body;
  const client = new MongoClient(uri);

  try {
    await client.connect();

    // ค้นหาข้อมูลผู้ใช้จากชื่อผู้ใช้ในฐานข้อมูล
    const user = await client.db('test').collection('users').findOne({ 'username': object.username });

    if (!user) {
      res.status(404).send({
        "status": "error",
        "message": "ไม่พบชื่อผู้ใช้"
      });
      return;
    }



    // เปรียบเทียบรหัสผ่านที่ป้อนกับรหัสผ่านในฐานข้อมูล
    const passwordMatch = await bcrypt.compare(object.password, user.password);

    if (!passwordMatch) {
      res.status(401).send({
        "status": "error",
        "message": "รหัสผ่านไม่ถูกต้อง"
      });
      return;
    }

    // ถ้าเข้าสู่ระบบสำเร็จ
    const token = generateToken(user._id.toString());
    console.log(token);
    console.log(user._id.toString());

    const detailUser = {
      userId: user._id.toString(),
      name: user.name,
      role: user.role
    }
    res.status(200).send({
      "status": "success",
      "message": "เข้าสู่ระบบสำเร็จ",
      "user": detailUser,
      "token": token
    });

  } catch (error) {
    console.error(error);
    res.status(500).send({
      "status": "error",
      "message": "เกิดข้อผิดพลาดในการเข้าสู่ระบบ"
    });
  } finally {
    await client.close();
  }
}







async function saveUser(req, res) {


  // ใช้ multer ในการจัดการอัปโหลดไฟล์
  upload(req, res, async function (err) {
    if (err) {
      // กรณีมีข้อผิดพลาดในการอัปโหลด
      console.error(err);
      return res.status(500).json({
        "status": "error",
        "message": "เกิดข้อผิดพลาดในการอัปโหลดไฟล์รูปภาพ"
      });
    }
  });

  const object = req.body;
  const client = new MongoClient(uri);

  try {
    await client.connect();

    if (object.confirmpassword !== object.password) {
      return res.status(400).send({
        "status": "error",
        "message": "รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน"
      });
    }

    const oldUser = await client.db('test').collection('users').findOne({ 'username': object.username });
    if (oldUser) {
      return res.status(400).send({
        "status": "error",
        "message": "ชื่อผู้ใช้นี้ถูกใช้ไปแล้ว"
      });
    }



    let base64Image = object.picture.base64;
    console.log(base64Image, "*** Base64 ***");
    let fname = object.picture.name
    console.log(fname, "*** file name ***");

    let filePath = path.join(__dirname, '../../uploads_register', `${fname}`);
    console.log(filePath, " *** FilePath ***");

    // ส่วนของการบันทึกไฟล์
    fs.writeFile(filePath, base64Image, { encoding: 'base64' }, function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({
          "status": "error",
          "message": "เกิดข้อผิดพลาดในการบันทึกไฟล์รูปภาพ"
        });
      }
      console.log('File created');
    });




    const hashedPassword = await bcrypt.hash(object.password, 10);

    await client.db('test').collection('users').insertOne({
      "picture": fname,
      "name": object.name,
      "email": object.email,
      "phone": object.phone,
      "username": object.username,
      "password": hashedPassword,
      "confirmpassword": object.confirmpassword,
      "role": object.role,
      "Isuse": "1",
    });


    return res.status(200).send({
      "status": "ok",
      "message": "สร้าง User เรียบร้อยแล้ว!!",
      "object": object
    });

  } catch (err) {
    console.error(err);
    return res.status(500).send({
      "status": "error",
      "message": "เกิดข้อผิดพลาดในการบันทึกข้อมูลผู้ใช้"
    });

  } finally {
    await client.close();
  }
}



async function registerUser(req, res) {
  const object = req.body;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const hashedPassword = await bcrypt.hash(object.password, 10);
    await client.db('test').collection('users').insertOne({
      "name": object.name,
      "email": object.email,
      "phone": object.phone,
      "username": object.username,
      "password": hashedPassword,
      "confirmpassword": object.confirmpassword,
      "Isuse": "1",
    });

    res.status(200).send({
      "status": "ok",
      "message": "สร้าง Userเรียบร้อยแล้ว!!",
      "object": object
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      "status": "error",
      "message": "เกิดข้อผิดพลาดในการสร้าง User"
    });
  } finally {
    await client.close();
  }
}





// app.put('/user/update', async (req, res) => {

async function updateUser(req, res) {

  try {
    const object = req.body;
    const id = object._id;
    const client = new MongoClient(uri);
    await client.connect();
    const hashedPassword = await bcrypt.hash(object.confirmpassword, 10);
    await client.db('test').collection('users').updateOne({ '_id': new ObjectId(id) }, {
      "$set": {
        "name": object.name,
        "email": object.email,
        "phone": object.phone,
        "username": object.username,
        "password": hashedPassword,
        "confirmpassword": object.confirmpassword,
        "role": object.role,
      }
    });
    if (object.picture?.base64) {
      let base64Image = object.picture.base64;
      console.log("470", base64Image);
      let fname = object.picture.name;
      let filePath = path.join(__dirname, '../../uploads_register', `${fname}`);
      console.log(filePath, "*** filePath ***");
      await client.db('test').collection('users').updateOne({ '_id': new ObjectId(id) }, {
        "$set": {
          "picture": fname,
        }
      });

    }
    await client.close();
    res.status(200).send({
      "status": "ok",
      "message": "Updated ข้อมูล ID = " + id + "เรียบร้อยเเล้ว!!",
      "object": object
    });

  } catch (err) {
    // await client.close();
    console.error(err);
    return res.status(500).send({
      "status": "error",
      "message": "เกิดข้อผิดพลาดในการแก้ไขข้อมูลผู้ใช้"
    });
  }
}


// app.put('/user/delete', async (req, res) => {

async function deleteUser(req, res) {

  const object = req.body;
  const id = object._id;
  const client = new MongoClient(uri);

  // สร้างค่าวันที่และเวลาปัจจุบัน
  const date = new Date();
  // แปลงปีเป็น ค.ศ.
  const year = date.getFullYear(); // รับปี
  // แปลงค่าวันที่และเวลาเป็นรูปแบบปีคริสต์ศักราช (ค.ศ.)
  const formattedDate = `${year}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  // แปลงชั่วโมงและนาทีเป็นรูปแบบ 2 ตำแหน่ง
  const formattedTime = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;


  console.log(formattedDate + ':' + formattedTime); // ปีคริสต์ศักราช

  await client.connect();
  await client.db('test').collection('users').updateOne({ '_id': new ObjectId(id) }, {
    "$set": {
      "Isuse": "0",
      "time_delete": formattedDate + ' ' + formattedTime,
    }
  });
  await client.close();
  res.status(200).send({
    "status": "ok",
    "message": "Delete ข้อมูล ID = " + id + "เรียบร้อยเเล้ว!!",
    "object": object
  });


}





// ค้นหาข้อมูลตาม id  ปกติ
// app.get('/user/:id', async (req, res) => {

async function getUserId(req, res) {
  try {
    const id = req.params.id;
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db('test');
    const collection = db.collection('users');
    const user = await collection.findOne({ "_id": new ObjectId(id) });
    await client.close();


    if (user) {
      res.status(200).send({
        "status": "ok",
        "message": "มี ID = " + id + " อยู่ในระบบเเล้ว!!",
        "object": user
      });

    } else {
      res.status(404).send({
        status: 'error',
        message: 'User not found.',
      });
    }

  } catch (error) {
    res.status(500).send({
      status: 'error',
      message: 'An error occurred while processing the request.',
    });
  }

}



//ค้นหาข้อมูลตาม username ปกติ

// app.get('/user/username/:username', async (req, res) => {

async function getUsername(req, res) {


  try {
    const { username } = req.params;
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db('test');
    const collection = db.collection('users');
    const user = await collection.findOne({ username: username });
    await client.close();

    if (user) {
      res.status(200).send({
        status: 'ok',
        "message": "มีข้อมูลผู้ใช้ " + username + " เเล้ว !!!",
        user: user,
      });
    } else {
      res.status(404).send({
        status: 'error',
        message: 'User not found.',
      });
    }
  } catch (error) {
    res.status(500).send({
      status: 'error',
      message: 'An error occurred while processing the request.',
    });
  }

}











// Read by id API
// app.get('/user/findtext/:searchText', async (req, res) => {

async function getSearch(req, res) {
  const { params } = req;
  const searchText = params.searchText
  const client = new MongoClient(uri);
  await client.connect();
  const objects = await client.db('test').collection('users').find({ $text: { $search: searchText } }).sort({ "FIELD": -1 }).limit(20).toArray();
  await client.close();
  res.status(200).send({
    "status": "ok",
    "searchText": searchText,
    "user": objects
  });
}


// // Query by filter API: Search text from username
// app.get('/user/username/:searchText', async (req, res) => {
//     try {
//         const { params } = req;
//         const searchText = params.searchText;
//         const client = new MongoClient(uri);
//         await client.connect();
//         const db = client.db('test');
//         const collection = db.collection('users');
//         const objects = await collection
//             .find({ username: { $regex: searchText, $options: 'i' } })
//             .toArray();
//         await client.close();
//         res.status(200).send({
//             status: 'ok',
//             searchText: searchText,
//             users: objects,
//         });
//     } catch (error) {
//         res.status(500).send({
//             status: 'error',
//             message: 'An error occurred while processing the request.',
//         });
//     }
// });


module.exports = {
  showimg,
  saveUser,
  registerUser,
  loginUser,
  getUserAll,
  updateUser,
  deleteUser,
  getUserId,
  getUsername,
  getSearch,
  authenticateToken,
  forgotPassword,
  resetPassword


}