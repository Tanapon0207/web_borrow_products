var express = require('express');
const usercontrol  = require('../controller/user_controller');
const verifyToken = require('../middleware/auth')
const routerUser = express.Router();


// Path ทั้้งหมดที่มีอยู่
//GET
routerUser.get('/user/me',verifyToken, function (req, res) {console.log("ok")});
routerUser.get('/user',usercontrol.getUserAll);
routerUser.get('/user/username/:username', usercontrol.getUsername);
routerUser.get('/user/findtext/:searchText', usercontrol.getSearch);
routerUser.get('/user/:id', usercontrol.getUserId);
routerUser.get('/user/reset-password/:id/:token', usercontrol.resetPassword);
routerUser.get('/showimg/:filename',usercontrol.showimg);

//PUT
routerUser.post('/user/update', usercontrol.updateUser);
routerUser.post('/user/delete', usercontrol.deleteUser);

// routerUser.get('/product/:id',usercontrol.getProductId);

//POST
routerUser.post('/user/create', usercontrol.saveUser); //usercontrol.uploadImg
routerUser.post('/user/register', usercontrol.registerUser); //usercontrol.
routerUser.post('/user/login', usercontrol.loginUser);
routerUser.post('/user/forgot-password', usercontrol.forgotPassword);
routerUser.post('/user/token', usercontrol.authenticateToken);
// routerUser.post('/welcome',usercontrol.authUser);



module.exports = routerUser;




