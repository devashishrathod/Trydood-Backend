const { sendSuccess, sendError } = require("../../utils");
const { verifyOtpWithMobile } = require("../../service/authServices");

exports.verifyOtp = async (req, res) => {
  try {
    const { data } = await verifyOtpWithMobile(req.body);
    return sendSuccess(res, 200, "Verification successful", data);
  } catch (error) {
    console.error("Error in verifyOtpWithMobile:", error);
    return sendError(
      res,
      error.statusCode || 500,
      error.message,
      error.errorData || {}
    );
  }
};
