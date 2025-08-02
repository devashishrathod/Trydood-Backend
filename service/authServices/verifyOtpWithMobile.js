const User = require("../../model/User");
const { ROLES } = require("../../constants");
const { generateToken } = require("../../middleware");
const { urlVerifyOtp } = require("../sendOTP");

exports.verifyOtpWithMobile = async ({
  sessionId,
  otp,
  whatsappNumber,
  role,
  fcmToken,
  currentScreen,
}) => {
  whatsappNumber = whatsappNumber?.toLowerCase();
  const user = await User.findOne({ whatsappNumber, role });
  if (!user) {
    throw { statusCode: 400, message: "User not found!" };
  }
  const result = await urlVerifyOtp(sessionId, otp);
  if (result?.Status !== "Success") {
    throw { statusCode: 400, message: "Invalid OTP" };
  }
  user.isMobileVerified = true;
  if (fcmToken) user.fcmToken = fcmToken;
  if (currentScreen) user.currentScreen = currentScreen.toUpperCase();
  await user.save();
  if (
    role === ROLES.VENDOR &&
    currentScreen?.toLowerCase() === "LANDING_SCREEN"
  ) {
    await User.updateOne(
      { whatsappNumber, role: ROLES.SUB_VENDOR },
      { $set: { isMobileVerified: true } }
    );
  }
  const token = await generateToken(user);
  return {
    data: {
      result,
      user,
      token,
    },
  };
};
