const { MongoClient } = require("mongodb");
// const { ObjectId } = require('mongodb');

const uri = "mongodb://127.0.0.1:27017/admin";



async function get_return_bill(req,res){
    const client = new MongoClient(uri);
    await client.connect();
    const object = await client.db('test').collection('return_bill').find().limit(1000000).toArray();
    await client.close();
    res.status(200).send(object);
}





async function add_return_bill(req, res) {
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
    try {
        await client.connect();
        await client.db('test').collection('return_bill').insertOne({
            "bill_no": object.bill_no,
            "nameuser": object.nameuser,
            "project": object.project,
            "details": object.details,
            "product_bill": object.product_bill,
            "return_date_time": formattedDate + ' ' + formattedTime,
            "ReturnBilluse": "1"
        });

        for (let i = 0; i < object.product_bill.length; i++) {
            const product_no_in_bill = object.product_bill[i].product_no;
            const amount_return_pr = object.product_bill[i].amount_return;
            const amount_bill_pr = object.product_bill[i].amount;

            if (amount_return_pr - amount_bill_pr == 0) {
                await client.db('test').collection('bills').updateOne({ 'bill_no': object.bill_no }, {
                    '$set': {
                        "Billuse": "0"
                    }
                })
            }

            const data_in_product_no = await client.db('table_product').collection('product').find({ 'product_no': product_no_in_bill }).limit(1000).toArray();

            for (i = 0; i < data_in_product_no.length; i++) {
                await client.db('table_product').collection('product').updateOne({ 'product_no': product_no_in_bill }, {
                    "$set": {
                        "amount": data_in_product_no[i].amount + amount_return_pr
                    }
                })
                break;
            }

        }

        res.status(200).send({
            "status": "ok",
            "message": "คืน bill เรียบร้อยแล้ว!!",
            "object": object
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            "status": "error",
            "message": "เกิดข้อผิดพลาดในการคืน bill",
            "error": error
        });
    } finally {
        await client.close();

    }
}





module.exports = {
    add_return_bill,
    get_return_bill
}