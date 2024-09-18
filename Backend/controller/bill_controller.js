const { MongoClient } = require("mongodb");
const { ObjectId } = require('mongodb')

const uri = "mongodb://127.0.0.1:27017/admin";




// app.get('/bill', async (req, res) => {
async function getAllBill(req, res) {
    const client = new MongoClient(uri);
    await client.connect();
    const object = await client.db('test').collection('bills').find().sort({ Billuse: "1" }, { Billuse: -1, borrow_datetime: -1 }).limit(1000000).toArray();
    await client.close();
    res.status(200).send(object);
}







// app.get('/bill/dashboard', async (req, res) => {

async function getBillDashboard(req, res) {
    const client = new MongoClient(uri);
    await client.connect();
    const object = await client.db('test').collection('bills').find().limit(1000000).toArray();
    await client.close();
    res.status(200).send(object);
}

async function get_amount_bill(req, res) {
    const client = new MongoClient(uri);
    await client.connect();
    const object = await client.db('test').collection('bills').find({ "Billuse": "1" }).limit(1000000).toArray();
    await client.close();
    res.status(200).send(object);
}

async function get_amount_return(req, res) {
    const client = new MongoClient(uri);
    await client.connect();
    const object = await client.db('test').collection('bills').find({ "Billuse": "0" }).limit(1000000).toArray();
    await client.close();
    res.status(200).send(object);
}





// app.post('/bill/create', async (req, res) => 
async function saveBill(req, res) {

    // สร้างค่าวันที่และเวลาปัจจุบัน
    const date = new Date();

    // แปลงปีเป็น ค.ศ.
    const year = date.getFullYear(); // รับปี

    // แปลงค่าวันที่และเวลาเป็นรูปแบบปีคริสต์ศักราช (ค.ศ.)
    const formattedDate = `${year}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

    // แปลงชั่วโมงและนาทีเป็นรูปแบบ 2 ตำแหน่ง
    const formattedTime = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    console.log(formattedDate + ' ' + formattedTime); // ปีคริสต์ศักราช

    const object = req.body;
    const client = new MongoClient(uri);
    await client.connect();
    await client.db('test').collection('bills').insertOne({
        "bill_no": object.bill_no,
        "nameuser": object.nameuser,
        "borrow_datetime": formattedDate + ' ' + formattedTime,
        "project": object.project,
        "product_bill": object.product_bill,
        "Billuse": "1",



    }).then(res => {

        for (i = 0; i < object.product_bill.length; i++) {
            console.log("97", object.product_bill[i]);
            console.log("98", object.product_bill[i].product_no);
            console.log("99", object.product_bill[i].amount);
            console.log("100", object.product_bill[i].amount_return);

            const add_amount_return = object.product_bill[i].amount
            console.log("110", add_amount_return);


        }

        console.log(res, "111")
        object.id = res.insertedId, "ID Bill"
        console.log("---96---", object.product_bill)


    });

    //การเช็คสินค้าาพร้อมกับการตัดสินค้าใคคลัง
    for (let i = 0; i < object.product_bill.length; i++) {
        console.log("103***", object.product_bill[i].product_no);
        console.log("104***", object.product_bill[i].amount);


        // await client.db('test').collection('bills').updateOne({ "product_no": object.product_bill[i].product_no }, {
        //     "$set": {
        //         "qty": object.product_bill[i].amount,
        //     }
        // });
        const product_no_bill = object.product_bill[i].product_no;
        // console.log("105", product_no_bill);
        const product_no_store = await client.db('table_product').collection('product').findOne({ "product_no": product_no_bill });
        // console.log("107", product_no_store);
        if (!product_no_store) {
            console.log(`ไม่มีสินค้าหมายเลข >> ${product_no_bill}  อยู่ในคลัง.`);
        }
        console.log(product_no_store.amount);
        console.log("148", object.product_bill[i].amount);
        console.log("149", object.product_bill[i].amount_return);

        //จำนวนคงเหลือของสินค้าในคลังเมื่อหักลบกับจำนวนที่ยืมไป
        const total_amount = product_no_store.amount - object.product_bill[i].amount_return;




        if (total_amount <= 0) {
            // เปลี่ยน Isuse เป็น 0 ถ้ายืมสินค้าจนหมด
            await client.db('table_product').collection('product').updateOne({ "product_no": product_no_bill }, {
                "$set": {
                    "Isuse": "0",
                }
            });
        } else {
            await client.db('table_product').collection('product').updateOne({ "product_no": product_no_bill }, {
                "$set": {
                    "amount": total_amount,
                }
            });
        }



    }



    await client.close();
    res.status(200).send({
        "status": "ok",
        "message": "สร้าง bill เรียบร้อยเเล้ว!!",
        "object": object
    })

}






// app.put('/bill/update', async (req, res) => {
async function updateBill(req, res) {

    try {
        const object = req.body;
        const id = object._id;
        const client = new MongoClient(uri);
        await client.connect();
        await client.db('test').collection('bills').updateOne({ '_id': new ObjectId(id) }, {
            "$set": {
                // id: parseInt(object.id),
                "bill_no": object.bill_no,
                "nameuser": object.nameuser,
                "borrow_datetime": object.borrow_datetime,
                "project": object.project,
                "product_bill": object.product_bill,
                "Billuse": "1",
            }
        });

        for (i = 0; i < object.product_bill.length; i++) {
            console.log("251", object.product_bill[i]);
            console.log("251", object.product_bill[i].product_no); //รหัสสินค้า
            console.log("251", object.product_bill[i].amount); // จำนวนที่ยืม

            const product_no_in_store = object.product_bill[i].product_no
            const amount_borrow_product = object.product_bill[i].amount

            const data_in_product_no = await client.db('table_product').collection('product').findOne({ 'product_no': product_no_in_store });
            console.log('253', data_in_product_no.amount);
            const amount_in_product = data_in_product_no.amount

            await client.db('table_product').collection('product').updateOne({ 'product_no': product_no_in_store }, {
                '$set': {
                    "amount": amount_in_product - amount_borrow_product,
                }
            });


        }

        res.status(200).send({
            "status": "ok",
            "message": "Updated ข้อมูลบิล = " + id + "เรียบร้อยเเล้ว!!",
            "object": object
        });

    } catch (err) {
        res.send(err)
        res.status(500).send({
            "status": "error",
            "message": "เกิดข้อผิดพลาดในการแก้ไขข้อมูล"

        })

    }



}



// app.put('/bill/delete', async (req, res) => {
async function daleteBill(req, res) {

    const object = req.body;
    const id = object._id;
    const client = new MongoClient(uri);
    await client.connect();
    await client.db('test').collection('bills').updateOne({ '_id': new ObjectId(id) }, {
        "$set": {
            // id: parseInt(object.id),

            "Billuse": "0"
        }
    });
    await client.close();
    res.status(200).send({
        "status": "ok",
        "message": "Updated ข้อมูล ID = " + id + "เรียบร้อยเเล้ว!!",
        "object": object
    });
}

















module.exports = {

    getAllBill,
    getBillDashboard,
    saveBill,
    updateBill,
    daleteBill,

    get_amount_bill,
    get_amount_return
    // returnBill

};