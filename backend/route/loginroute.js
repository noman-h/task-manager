const express = require("express");
const router = express.Router();

const logincontroller = require("../controller/logincontroller");

const auth = require("../middleware/auth");
const firebaseauth = require("../middleware/firebaseauth");

router.post("/singup", logincontroller.singup);
router.post("/login", logincontroller.login);
router.post("/googlelogin", firebaseauth, logincontroller.googlelogin);
router.patch("/otpsend", logincontroller.otpsend);
router.patch("/otpcheck", logincontroller.otpcheck);
router.patch("/forgetpass", logincontroller.forgetpass);
router.patch("/changetheme", auth, logincontroller.changetheme);
router.patch("/resetpass", auth, logincontroller.resetpass);
router.get("/getuser", auth, logincontroller.getuser);
router.get("/alluser", auth, logincontroller.alluser);

module.exports = router;
