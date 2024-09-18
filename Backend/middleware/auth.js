const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
  // กำหนดการเรียกเก็บ token ผ่านค่าตัวแปล x-access-token สามารถเปลี่ยนเป็นตัวแปลอื่นได้
  const token = req.body.token || req.query.token || req.headers["x-access-token"];

  try {
    if (!token) {
      return res.status(403).send("จำเป็นต้องมี Token ในการ login ⚠️ ");
    } else {
      return res.status(200).send("YOU HAVE TAKEN !!!");
    }
  } catch (err) {
    return res.status(401).send("ไม่มี Token นี้อยู่ในระบบ หรือ Token หมดอายุ ⚠️");
  }

  // if (!token) {
  //   return res.status(403).send("จำเป็นต้องมี Token ในการ login ⚠️ ");
  // }
  // // else{
  // //   return res.status(200).send('You have Token Wellcomeback !!!')
  // // }
  // else try {
  //   const decoded = jwt.verify(token, config.TOKEN_KEY);
  //   req.user = decoded;


  //     return res.status(200).send("You have token !!!");


  // } catch (err) {
  //   return res.status(401).send("ไม่มี Token นี้อยู่ในระบบ หรือ Token หมดอายุ ⚠️");
  // }
  // return next();
};

module.exports = verifyToken;