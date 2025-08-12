const express = require("express");
const router = express.Router();

const { loginOrSignUp, verifyOtp } = require("../controller/auth");

router.post("/loginOrSignUp", loginOrSignUp);
router.put("/verifyOtp", verifyOtp);

router.post("/sendWhatsappOTP", require("../controller/auth/sendOtp").sendOTP);
router.put(
  "/verifyWhatsappOtp",
  require("../controller/auth/sendOtp").verifyOtp
);

module.exports = router;
