const { sendSuccess, sendError } = require("../../utils");
const { loginOrSignUpWithMobile } = require("../../service/authServices");

exports.loginOrSignUp = async (req, res) => {
  try {
    const { data, isFirst } = await loginOrSignUpWithMobile(req.body);
    return sendSuccess(
      res,
      200,
      "OTP sent to your whatsapp number successfully.",
      { isFirst, ...data }
    );
  } catch (error) {
    console.error("Error in loginOrSignUpWithMobile:", error);
    return sendError(
      res,
      error.statusCode || 500,
      error.message,
      error.errorData || {}
    );
  }
};
