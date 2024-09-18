
const { MongoClient } = require("mongodb");
const { ObjectId } = require('mongodb')

const uri = "mongodb://127.0.0.1:27017/admin";

const express = require('express');
const app = express();
const cors = require('cors');
var bodyParser = require("body-parser");
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
const multer = require('multer'); //uplode files


app.use(cors({
    origin: 'https://localhost:4200',
    methods: 'GET, PUT, POST, DELETE, HEAD, OPTIONS, PATCH',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/product/create', express.static(path.join(__dirname, '../../uploads')));



const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, path.join(__dirname, '../../uploads'));
    },
    filename: function (req, file, callback) {
        const extname = path.extname(file.originalname);
        const filename = `${Date.now()} ${extname}`;
        callback(null, filename);
    }
})

const upload = multer({ storage: storage }).single('file');





// เเสดงค่า product ทั้งหมดที่มี
async function getAllProduct(req, res) {
    console.log("Product")
    const client = new MongoClient(uri);
    await client.connect();
    const object = await client.db('test').collection('product')
        .find({ Isuse: "1" }).limit(1000000).toArray();
    await client.close();
    res.status(200).send(object);

}

async function showimg_product(req, res) {

    const filename = req.params.filename;
    if (filename) {
        res.sendFile(path.join(__dirname, '../../uploads', filename));
    } else {
        res.status(404).send('File not found');
    }

}


// เพิ่ม product
// app.post('/product/create', async (req, res) => {
async function saveProduct(req, res) {



    // สร้างค่าวันที่และเวลาปัจจุบัน
    const date = new Date();

    // แปลงปีเป็น ค.ศ.
    const year = date.getFullYear(); // รับปี

    // แปลงค่าวันที่และเวลาเป็นรูปแบบปีคริสต์ศักราช (ค.ศ.)
    const formattedDate_add = `${year}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

    // แปลงชั่วโมงและนาทีเป็นรูปแบบ 2 ตำแหน่ง
    const formattedTime_add = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    console.log(formattedDate_add + ' ' + formattedTime_add); // ปีคริสต์ศักราช


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


    let base64Image = object.picture.base64;
    console.log(base64Image, "*** product base64 image ***");

    let file_product_name = object.picture.name
    console.log(file_product_name, "*** filename ***");

    let filePath = path.join(__dirname, '../../uploads', `${file_product_name}`);
    console.log(filePath, "*** filePath ***");

    fs.writeFile(filePath, base64Image, { encoding: 'base64' }, function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({
                "status": "error",
                "message": "เกิดข้อผิดพลาดในการบันทึกไฟล์รูปภาพ"
            });
        }
        console.log('File created');
    })



    await client.connect();
    await client.db('test').collection('product').insertOne({

        // "date_buy": object.date_buy,
        "barcode": object.barcode,
        "product_no": object.product_no,
        "model": object.model,
        "product_name": object.product_name,
        "brand": object.brand,
        "amount": object.amount,

        "picture": file_product_name,
        "time_add": formattedDate_add +' '+ formattedTime_add,
        "time_update": "Not Updated Porduct",
        "time_delete": "Not Delete Porduct",
        "Isuse": "1",



        /*
                  time_add: formattedDate,  // เพิ่มค่าเวลาที่เพิ่มสินค้า
                  time_update: "not updated",
                  time_delete: "not deleted",
      */


    }).then(res => {

        console.log(object.product_no)
        console.log(object.barcode);
        object.id = res.insertedId
    });


 

    await client.close();
    res.status(200).send({
        "status": "ok",
        "message": "สร้าง product เรียบร้อยเเล้ว!!",
        "object": object
    })


}


// แก้ไข product
// app.put('/product/update', async (req, res) => {
async function updateProduct(req, res) {

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
    const formattedTime= `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;


    console.log(formattedDate +' '+ formattedTime); // ปีคริสต์ศักราช

    await client.connect();
    await client.db('test').collection('product').updateOne({ '_id': new ObjectId(id) }, {
        "$set": {
           
            "product_no": object.product_no,
            "model": object.model,
            "product_name": object.product_name,
            "brand": object.brand,
            "amount": object.amount,
            // time_add: object.time_product.time_add,   // เพิ่มค่าเวลาที่เพิ่มสินค้า
            "time_update": formattedDate +' '+ formattedTime,
            "time_delete": "Not Delete Porduct",
        }
    });
    if(object.picture?.base64){
        let base64Image = object.picture.base64;
        console.log(base64Image, "*** product base64 image ***");
    
        let file_product_name = object.picture.name
        console.log(file_product_name, "*** filename ***");
    
        let filePath = path.join(__dirname, '../../uploads', `${file_product_name}`);
        console.log(filePath, "*** filePath ***");
        await client.db('test').collection('product').updateOne({ '_id': new ObjectId(id) }, {
            "$set": {
                "picture": file_product_name,
            }
        });
    }
    
    await client.close();
    res.status(200).send({
        "status": "ok",
        "message": "Updated ข้อมูล ID = " + id + "เรียบร้อยเเล้ว!!",
        "object": object
    });

}


// ลบ product
// app.put('/product/delete', async (req, res) => {
async function daleteProduct(req, res) {
    const object = req.body;
    const id = object._id;
    const client = new MongoClient(uri);

    // สร้างค่าวันที่และเวลาปัจจุบัน
    const date = new Date();
    // แปลงปีเป็น ค.ศ.
    const year = date.getFullYear();
    // แปลงค่าวันที่และเวลาเป็นรูปแบบปีคริสต์ศักราช (ค.ศ.)
    const formattedDate = `${year} - ${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`

    //  แปลงชั่วโมงและนาทีเป็นรูปแบบ 2 ตำแหน่ง
    const formattedTime = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

    console.log("วันเวลาที่คุณทำการลบสินค้าไป" + formattedDate + '   ' + formattedTime); // ปีคริสต์ศักราช

    await client.connect();
    await client.db('test').collection('product').updateOne({ '_id': new ObjectId(id) }, {
        "$set": {
            "Isuse": "0",
            "time_delete": formattedDate + ' ' + formattedTime,
        }
    });




    await client.close();
    res.status(200).send({
        "status": "ok",
        "message": "Updated ข้อมูล ID = " + id + "เรียบร้อยเเล้ว!!",
        "object": object

    });



}


// คืน product
// app.put('/product/back', async (req, res) => {
async function backProduct(req, res) {
    const object = req.body;
    const id = req.params._id;
    const client = new MongoClient(uri);

    await client.connect();
    await client.db('test').collection('product').updateOne({ '_id': new ObjectId(id) }, {
        "$set": {
            id: parseInt(object.id),
            "Isuse": "1"
        }
    });
    await client.close();
    res.status(200).send({
        "status": "ok",
        "message": "Updated ข้อมูล ID = " + id + "เรียบร้อยเเล้ว!!",
        "object": object
    });


}



// // app.get('/product/:id', async (req, res) => {
// async function getProductId(req, res) {
//     const id = req.params.id;
//     const client = new MongoClient(uri);
//     await client.connect();
//     const product = await client.db('test').collection('product').findOne({ '_id': new ObjectId(id) },{

//     });


//     res.status(200).send({
//         "status": "ok",
//         "message": "มี ID = " + id + " อยู่ในระบบเเล้ว!!",
//         "object": product
//     });

//     await client.close();

// }


//  ค้นหา barcode
// app.get('/product/barcode/:barcode', async (req, res) => {
async function getProductBarcode(req, res) {
    try {
        const { barcode } = req.params;
        const client = new MongoClient(uri);
        await client.connect();
        const barcode_id = await client.db('test').collection('product').findOne({ barcode: barcode }); //,Isuse: "1"
        await client.close();

        if (barcode_id) {
        //    console.log("bill_con 325",barcode_id);


        //     barcode_id.amount_return = barcode_id.product_no.amount 
        //     //    const balance = barcode_id.qty-amount;
        //     //    console.log(balance ,"ยอดคงเหลือ");
        //     console.log("Qty",barcode_id.qty);
            res.status(200).send({
                barcode_id: barcode_id,
                message: 'มี Barcode นี้อยู่ในฐานข้อมูลเรียบร้อยเเล้ว'

            });
        } else {

            res.status(404).send({
                status: 'error',
                message: 'ไม่มี Barcode อยู่ในฐานข้อมูลนี้.',
            });
        }
    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: 'เกิดข้อผิดพลาดขณะประมวลผลคำขอข้อมูล',
        });
    }
}


// ส่งค่าออก
module.exports = {
    showimg_product,
    getAllProduct,
    saveProduct,
    updateProduct,
    daleteProduct,
    backProduct,
    // getProductId,
    getProductBarcode,
};