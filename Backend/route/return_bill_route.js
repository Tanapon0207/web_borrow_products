const express = require('express');
const return_bill_control = require('../controller/return_bill_controller');
const router_return_Bill = express.Router();

//GET 
router_return_Bill.get('/return_bill', return_bill_control.get_return_bill);


//POST
router_return_Bill.post('/return_bill/add', return_bill_control.add_return_bill);


module.exports = router_return_Bill;