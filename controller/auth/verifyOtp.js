const { asyncWrapper, sendSuccess } = require("../../utils");
const { verifyOtpWithMobile } = require("../../service/authServices");

exports.verifyOtp = asyncWrapper(async (req, res) => {
  const { data } = await verifyOtpWithMobile(req.body);
  return sendSuccess(res, 200, "Verification successful", data);
});
