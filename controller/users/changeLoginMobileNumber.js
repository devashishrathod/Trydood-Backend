// const { urlSendTestOtp } = require("../../service/sendOTP");
const { sendOtp } = require("../../service/otpServices");
const { sendSuccess, sendError } = require("../../utils");
const { getUserByFields } = require("../../service/userServices");
const {
  getSubBrandByFields,
  getSubBrandById,
} = require("../../service/subBrandServices");

// change user/vendor mobile number
exports.changeLoginMobileNumber = async (req, res) => {
  try {
    const user = req?.payload;
    const previousMobile = user?.whatsappNumber;
    let { whatsappNumber, subBrandId, role } = req.body;
    if (previousMobile == whatsappNumber) {
      return sendError(
        res,
        400,
        "You have already registered with this mobile number"
      );
    }
    whatsappNumber = whatsappNumber?.toLowerCase();
    const checkUser = await getUserByFields({ whatsappNumber, role });
    if (checkUser) {
      return sendError(
        res,
        400,
        "User already exist with this mobile number! Please choose a defferent number"
      );
    }
    if (subBrandId) {
      const checksubBrand = await getSubBrandById(subBrandId);
      if (!checksubBrand)
        return sendError(res, 404, "No sub-brand/outlet found!");
      const existingSubBrandWithMobile = await getSubBrandByFields({
        whatsappNumber: whatsappNumber,
      });
      if (existingSubBrandWithMobile) {
        return sendError(
          res,
          404,
          "Sub-brand already exist with this mobile number."
        );
      }
    }
    //  const result = await urlSendTestOtp(whatsappNumber);
    const result = await sendOtp(whatsappNumber);
    if (result.ApiResponse == "Fail") {
      return sendError(res, 503, "Please try again! OTP service unavailable");
    }
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
