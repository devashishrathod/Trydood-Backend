const User = require("../../model/User");
const { getBrandById } = require("../../service/brandServices");
const { getSubscribedById } = require("../../service/subscribedServices");
const {
  generateUniqueUserId,
  getUserByFields,
} = require("../../service/userServices");
const { urlSendTestOtp } = require("../../service/sendOTP");
const { generateReferralCode, sendError, sendSuccess } = require("../../utils");
const { ROLES } = require("../../constants");

exports.signUpSubBrandWithMobile = async (req, res) => {
  try {
    const brandId = req?.params?.brandId;
    const { whatsappNumber } = req.body;
    if (!whatsappNumber)
      return sendError(res, 400, "WhatsApp number is required");
    const checkBrand = await getBrandById(brandId);
    if (!checkBrand) return sendError(res, 404, "Brand not found!");
    if (!checkBrand?.isSubscribed) {
      return sendError(
        res,
        403,
        "Access denied. This feature requires an active subscription. Please subscribe to continue."
      );
    }
    const currentSubscribed = await getSubscribedById(checkBrand?.subscribed);
    if (currentSubscribed?.isExpired) {
      return sendError(
        res,
        403,
        "Your subscription has expired. Please renew or upgrade your plan to continue using this feature."
      );
    }
    const { subBrandsLimit, subBrandsUsed } = checkBrand;
    if (subBrandsLimit <= subBrandsUsed) {
      return sendError(
        res,
        403,
        "Sub-brand Limit Exceeded! You have reached the maximum number of sub-brands allowed under your current plan. Please upgrade your subscription to add more sub-brands."
      );
    }
    let otpResult;
    let existingSubVendor = await getUserByFields({
      whatsappNumber: whatsappNumber.toLowerCase(),
      role: ROLES.SUB_VENDOR,
    });
    if (existingSubVendor && existingSubVendor.isMobileVerified) {
      return sendError(
        res,
        409,
        "This WhatsApp number is already registered as a Sub Vendor."
      );
    } else if (existingSubVendor && !existingSubVendor.isMobileVerified) {
      otpResult = await urlSendTestOtp(existingSubVendor.whatsappNumber);
    } else {
      existingSubVendor = new User({
        whatsappNumber,
        role: ROLES.SUB_VENDOR,
        uniqueId: await generateUniqueUserId(),
        referCode: generateReferralCode(6),
      });
      await subBrand.save();
    }
    otpResult = await urlSendTestOtp(whatsappNumber);
    return sendSuccess(
      res,
      201,
      "OTP sent successfully to sub-brand WhatsApp number.",
      { result: otpResult, user: existingSubVendor }
    );
  } catch (error) {
    console.error("Error verifying sub-brand mobile:", error);
    return sendError(res, 500, "Internal Server Error");
  }
};
