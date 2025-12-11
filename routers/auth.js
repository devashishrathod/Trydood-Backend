const express = require("express");
const router = express.Router();

const { register, loginOrSignUp, verifyOtp } = require("../controller/auth");

router.post("/register", register);
router.post("/loginOrSignUp", loginOrSignUp);
router.put("/verifyOtp", verifyOtp);

module.exports = router;
