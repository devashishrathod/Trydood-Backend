const { ROLES } = require("../../constants");
const { sendError, sendSuccess } = require("../../utils/response");
const { getUserByPan, updateUserById } = require("../../service/userServices");
const {
  createBrand,
  getBrandByName,
  generateUniqueBrandId,
} = require("../../service/brandServices");
const {
  addGst,
  getGstByNumber,
  updateGstByNumber,
} = require("../../service/gstServices");
const { isValidPAN, isValidGSTIN } = require("../../validator/common");

// Add a new brand by Brand Vendor
exports.addBrand = async (req, res) => {
  try {
    const brandVendor = req?.payload;
    let errorMsg = null;
    if (
      !brandVendor ||
      brandVendor.role !== ROLES.VENDOR ||
      !brandVendor.isMobileVerified ||
      brandVendor.brand
    ) {
      if (!brandVendor) {
        errorMsg = "Access denied. Vendor not found.";
      } else if (brandVendor.role !== ROLES.VENDOR) {
        errorMsg = "Access restricted. Only vendors can perform this action.";
      } else if (!brandVendor.isMobileVerified) {
        errorMsg = "Please verify your mobile number to proceed.";
      } else if (brandVendor.brand) {
        errorMsg = "Brand already exists! You can register only a brand";
      }
      return sendError(res, 403, errorMsg);
    }
    let {
      name,
      slogan,
      companyName,
      companyEmail,
      whatsappNumber,
      panNumber,
      gstNumber,
      referMarketId,
      referMarketMobile,
      currentScreen,
    } = req.body;
    name = name?.toLowerCase();
    const checkBrand = await getBrandByName(name);
    if (checkBrand) return sendError(res, 409, "Brand already exists");

    panNumber = panNumber?.toUpperCase();
    gstNumber = gstNumber?.toUpperCase();
    let brandGst = null;
    if (panNumber) {
      const isValid = isValidPAN(panNumber);
      const checkPan = isValid ? await getUserByPan(panNumber) : null;
      if (!isValid || checkPan) {
        const message = !isValid
          ? "Invalid PAN number"
          : "PAN number already exists";
        return sendError(res, 400, message);
      }
    }
    if (gstNumber && isValidGSTIN(gstNumber)) {
      const checkGst = await getGstByNumber(gstNumber);
      if (checkGst) return sendError(res, 409, "Gst already exists");
      const gstData = {
        gstNumber,
        panNumber: panNumber ? panNumber : null,
        companyName: companyName?.toLowerCase(),
        user: brandVendor._id,
      };
      brandGst = await addGst(gstData);
    }
    const brandData = {
      name: name?.toLowerCase(),
      slogan: slogan?.toLowerCase(),
      companyName: companyName?.toLowerCase(),
      companyEmail: companyEmail
        ? companyEmail?.toLowerCase()
        : brandVendor?.email,
      whatsappNumber: whatsappNumber
        ? whatsappNumber?.toLowerCase()
        : brandVendor.mobile,
      panNumber,
      gst: brandGst ? brandGst._id : null,
      referMarketId,
      referMarketMobile,
      user: brandVendor._id,
      uniqueId: await generateUniqueBrandId(),
      currentScreen: currentScreen?.toUpperCase(),
      isSignUpCompleted: true,
    };
    const newBrand = await createBrand(brandData);
    const updatedUser = await updateUserById(brandVendor._id, {
      panNumber: panNumber ? panNumber : null,
      gst: brandGst ? brandGst._id : null,
      brand: newBrand._id,
      currentScreen: currentScreen?.toUpperCase(),
      isSignUpCompleted: true,
    });
    if (brandGst) await updateGstByNumber(gstNumber, { brand: newBrand._id });
    return sendSuccess(res, 201, "Brand added successfully", {
      brand: newBrand,
      user: updatedUser,
    });
  } catch (error) {
    console.log("error on addBrand: ", error);
    return sendError(res, 500, error.message);
  }
};
