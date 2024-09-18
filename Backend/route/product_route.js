
var express = require('express');
const producCtrlt  = require('../controller/product_controller');
const routerPrd = express.Router();


// Path ทั้้งหมดที่มีอยู่
//GET
routerPrd.get('/product',producCtrlt.getAllProduct);
routerPrd.get('/product/barcode/:barcode', producCtrlt.getProductBarcode);
routerPrd.get('/productimg/:filename', producCtrlt.showimg_product);

//POST
routerPrd.post('/product/create', producCtrlt.saveProduct);

//PUT
routerPrd.post('/product/update', producCtrlt.updateProduct);
routerPrd.post('/product/delete', producCtrlt.daleteProduct);
routerPrd.post('/product/back', producCtrlt.backProduct);

// routerPrd.get('/product/:id',producCtrlt.getProductId);



module.exports = routerPrd;