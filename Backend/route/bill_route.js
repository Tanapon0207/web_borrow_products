var express = require('express');
const billcontrol  = require('../controller/bill_controller');
// const router = require('../../server');
const routerBill = express.Router();


// Path ทั้้งหมดที่มีอยู่

//GET
routerBill.get('/bill',billcontrol.getAllBill);
routerBill.get('/bill/amount_bill',billcontrol.get_amount_bill);
routerBill.get('/bill/amount_return',billcontrol.get_amount_return);

routerBill.get('/bill/dashboard', billcontrol.getBillDashboard);

//POST
routerBill.post('/bill/create', billcontrol.saveBill);


//PUT
routerBill.post('/bill/update', billcontrol.updateBill);
routerBill.post('/bill/delete', billcontrol.daleteBill);
// routerBill.post('/bill/return', billcontrol.returnBill);
// routerBill.post('/bill/:product_no_bill',billcontrol.update_amount_product)



module.exports = routerBill;

