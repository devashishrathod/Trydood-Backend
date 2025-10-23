const express = require("express");
const router = express.Router();

const { loginOrSignUp, verifyOtp } = require("../controller/auth");

router.post("/loginOrSignUp", loginOrSignUp);
router.put("/verifyOtp", verifyOtp);

module.exports = router;
