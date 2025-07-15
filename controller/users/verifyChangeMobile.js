const { urlVerifyOtp } = require("../../service/sendOTP");
const { sendSuccess, sendError } = require("../../utils");
const {
  getUserByFields,
  updateUserById,
} = require("../../service/userServices");

// verify OTP and change users Mobile number and generate new token
exports.verifyChangeMobile = async (req, res) => {
  try {
    const userId = req?.payload?._id;
    const checkUser = await getUserByFields({ _id: userId });
    if (!checkUser) {
      return sendError(res, 400, "User not found");
    }
    let { sessionId, otp, whatsappNumber, fcmToken, currentScreen } = req.body;
    // const sessionId = req?.body?.sessionId;
    // const otp = req?.body?.otp;
    // const whatsappNumber = req?.body?.whatsappNumber?.toLowerCase();
    // const fcmToken = req?.body?.fcmToken;
    // const currentScreen = req?.body?.currentScreen?.toUpperCase();
    whatsappNumber = whatsappNumber?.toLowerCase();
    currentScreen = currentScreen?.toUpperCase();
    let updatedUser;
    const existingUserWithMobile = await getUserByFields({
      mobile: whatsappNumber,
    });
    if (existingUserWithMobile) {
      return sendError(
        res,
        400,
        "User already exist with this mobile number! Please choose a defferent number"
      );
    }
    const result = await urlVerifyOtp(sessionId, otp);
    if (result?.Status !== "Success") {
      return sendError(res, 400, "Invalid OTP", result);
    }
    if (result?.Status == "Success") {
      updatedUser = await updateUserById(userId, {
        currentScreen: currentScreen ? currentScreen : checkUser?.currentScreen,
        isMobileVerified: true,
        fcmToken: fcmToken ? fcmToken : checkUser?.fcmToken,
        mobile: whatsappNumber,
        whatsappNumber: whatsappNumber,
      });
      const token = await generateToken(updatedUser);
      return sendSuccess(
        res,
        200,
        "Verification successfully! Your mobile number changed successfully",
        { result, user: updatedUser, token }
      );
    }
  } catch (error) {
    console.log("error on verifyOtp and change mobile number: ", error);
    return sendError(res, 500, error.message);
  }
};
