const { asyncWrapper, sendSuccess } = require("../../utils");
const { loginOrSignUpWithMobile } = require("../../service/authServices");

exports.loginOrSignUp = asyncWrapper(async (req, res) => {
  const { data, isFirst } = await loginOrSignUpWithMobile(req.body);
  return sendSuccess(
    res,
    200,
    "OTP sent to your whatsapp number successfully.",
    { isFirst, ...data }
  );
});
