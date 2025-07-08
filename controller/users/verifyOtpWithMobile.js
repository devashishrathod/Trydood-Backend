exports.verifyOtp = async (req, res) => {
  const sessionId = req.body.sessionId;
  const otp = req.body.otp;
  const mobile = req.body?.mobile?.toLowerCase();
  const fcmToken = req.body?.fcmToken;
  const currentScreen = req.body?.currentScreen?.toUpperCase();
  try {
    const checkUser = await User.findOne({ mobile });
    if (!checkUser) {
      return res.status(400).json({ success: false, msg: "User not found!" });
    }
    let result = await urlVerifyOtp(sessionId, otp);
    if (result?.Status == "Success") {
      if (currentScreen) checkUser.currentScreen = currentScreen;
      checkUser.isMobileVerified = true;
      checkUser.fcmToken = fcmToken;
      await checkUser.save();
      const token = await generateToken(checkUser);
      return res.status(200).json({
        success: true,
        msg: "Verification successful",
        result,
        user: checkUser,
        token,
      });
    }
    return res.status(400).json({ success: false, msg: "Invalid OTP" });
  } catch (error) {
    console.log("error on verifyOtp: ", error);
    return res
      .status(500)
      .json({ error: error, success: false, msg: error.message });
  }
};
