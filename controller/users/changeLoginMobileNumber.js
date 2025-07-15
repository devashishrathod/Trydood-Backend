const { getUserByFields } = require("../../service/userServices");
const { urlSendTestOtp } = require("../../service/sendOTP");
const { sendSuccess, sendError } = require("../../utils");

// change user/vendor mobile number
exports.changeLoginMobileNumber = async (req, res) => {
  try {
    const user = req?.payload;
    const previousMobile = user?.mobile;
    let { whatsappNumber } = req.body;
    if (previousMobile == whatsappNumber) {
      return sendError(
        res,
        400,
        "You have already registered with this mobile number"
      );
    }
    whatsappNumber = whatsappNumber?.toLowerCase();
    const checkUser = await getUserByFields({ mobile: whatsappNumber });
    if (checkUser) {
      return sendError(
        res,
        400,
        "User already exist with this mobile number! Please choose a defferent number"
      );
    }
    const result = await urlSendTestOtp(whatsappNumber);
    return sendSuccess(
      res,
      200,
      "OTP sent to your mobile number successfully.",
      { result, user: checkUser }
    );
  } catch (error) {
    console.log("error on change mobile: ", error);
    return sendError(res, 500, error.message);
  }
};
