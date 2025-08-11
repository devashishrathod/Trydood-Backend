const User = require("../../model/User");
const { ROLES } = require("../../constants");
const { generateReferralCode } = require("../../utils");
// const { urlSendTestOtp } = require("../../service/sendOTP");
const { sendOtp } = require("../../service/otpServices");
const { generateUniqueUserId, getUserByFields } = require("../userServices");

exports.loginOrSignUpWithMobile = async ({
  role,
  whatsappNumber,
  fcmToken,
}) => {
  role = role || ROLES.USER;
  whatsappNumber = whatsappNumber?.toLowerCase();
  let isFirst = false;
  let user = await getUserByFields({ whatsappNumber, role });

  if (role === ROLES.SUB_VENDOR && !user) {
    const error = {
      statusCode: 404,
      message: "Sub Vendor not found! Please contact brand's vendor.",
    };
    throw error;
  }
  if (!user) {
    isFirst = true;
    user = new User({
      whatsappNumber,
      role,
      uniqueId: await generateUniqueUserId(),
      referCode: generateReferralCode(6),
      fcmToken: fcmToken || null,
    });
    await user.save();
    if (role === ROLES.VENDOR) {
      const subVendorExists = await getUserByFields({
        whatsappNumber,
        role: ROLES.SUB_VENDOR,
      });
      if (!subVendorExists) {
        const subVendor = new User({
          whatsappNumber,
          role: ROLES.SUB_VENDOR,
          uniqueId: await generateUniqueUserId(),
          referCode: generateReferralCode(6),
        });
        await subVendor.save();
      }
    }
  }
  // const otpResult = await urlSendTestOtp(whatsappNumber);
  const otpResult = await sendOtp(whatsappNumber);
  if (otpResult.ApiResponse == "Fail") {
    return sendError(res, 503, "Please try again! OTP service unavailable");
  }
  return {
    isFirst,
    data: {
      result: otpResult,
      user,
    },
  };
};
