// const { urlVerifyOtp } = require("../../service/sendOTP");
const { ROLES } = require("../../constants");
const { verifyOtp } = require("../../service/otpServices");
const { sendSuccess, sendError } = require("../../utils");
const { generateToken } = require("../../middleware/authValidation");
const { updateBrandById } = require("../../service/brandServices");
const {
  getUserByFields,
  updateUserById,
} = require("../../service/userServices");
const {
  getSubBrandByFields,
  getSubBrandById,
  updateSubBrandById,
} = require("../../service/subBrandServices");

// verify OTP and change users Mobile number and generate new token
exports.verifyChangeMobile = async (req, res) => {
  try {
    const userId = req?.payload?._id;
    const checkUser = await getUserByFields({ _id: userId });
    if (!checkUser) {
      return sendError(res, 400, "User not found");
    }
    let {
      // sessionId,
      otp,
      role,
      whatsappNumber,
      subBrandId,
      fcmToken,
      currentScreen,
    } = req.body;
    whatsappNumber = whatsappNumber?.toLowerCase();
    currentScreen = currentScreen?.toUpperCase();
    let updatedUser;
    let checksubBrand;
    const existingUserWithMobile = await getUserByFields({
      whatsappNumber,
      role,
    });
    if (existingUserWithMobile) {
      return sendError(
        res,
        400,
        "User already exist with this mobile number! Please choose a defferent number"
      );
    }
    if (subBrandId) {
      checksubBrand = await getSubBrandById(subBrandId);
      if (!checksubBrand) {
        return sendError(res, 404, "No sub-brand/outlet found!");
      }
      const existingSubBrandWithMobile = await getSubBrandByFields({
        whatsappNumber: whatsappNumber,
      });
      if (existingSubBrandWithMobile) {
        return sendError(
          res,
          404,
          "Sub-brand already exist  with this mobile number."
        );
      }
    }
    // const result = await urlVerifyOtp(sessionId, otp);
    // if (result?.Status !== "Success") {
    //   return sendError(res, 400, "Invalid OTP", result);
    // }
    let result = await verifyOtp(whatsappNumber, otp);
    if (!result?.ok) {
      return sendError(res, 400, result?.reason);
    }
    const updatedUserData = {
      currentScreen: currentScreen ? currentScreen : checkUser?.currentScreen,
      isMobileVerified: true,
      fcmToken: fcmToken ? fcmToken : checkUser?.fcmToken,
      whatsappNumber: whatsappNumber,
    };
    if (subBrandId) {
      updatedUser = await updateUserById(checksubBrand?.user, updatedUserData);
    } else {
      updatedUser = await updateUserById(userId, updatedUserData);
    }
    const updatedMobile = {
      currentScreen: currentScreen ? currentScreen : checkUser?.currentScreen,
      whatsappNumber: whatsappNumber,
    };
    if (subBrandId) {
      await updateSubBrandById(subBrandId, updatedMobile);
    } else if (role === ROLES.SUB_VENDOR) {
      await updateSubBrandById(checkUser?.subBrand, updatedMobile);
    } else if (role === ROLES.VENDOR) {
      await updateBrandById(checkUser?.brand, updatedMobile);
    }
    const token = await generateToken(updatedUser);
    return sendSuccess(
      res,
      200,
      "Verification successfully! Your mobile number changed successfully",
      { result, user: updatedUser, token }
    );
  } catch (error) {
    console.log("error on verifyOtp and change mobile number: ", error);
    return sendError(res, 500, error.message);
  }
};
