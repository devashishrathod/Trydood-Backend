const { ROLES } = require("../../constants");
const { getBrandByName } = require("../../service/brandServices");
const { sendError, sendSuccess } = require("../../utils/response");
const { isValidPAN, isValidGSTIN } = require("../../validator/common");

exports.addBrand = async (req, res) => {
  try {
    const brandVendor = req?.payload;
    let errorMsg = null;
    if (
      !brandVendor ||
      brandVendor.role !== ROLES.VENDOR ||
      !brandVendor.isMobileVerified
    ) {
      if (!brandVendor) {
        errorMsg = "Access denied. Vendor not found.";
      } else if (brandVendor.role !== ROLES.VENDOR) {
        errorMsg = "Access restricted. Only vendors can perform this action.";
      } else if (!brandVendor.isMobileVerified) {
        errorMsg = "Please verify your mobile number to proceed.";
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
    } = req.body;

    const checkBrand = await getBrandByName(name);
    if (checkBrand) return sendError(res, 409, "Brand already exists");

    panNumber = panNumber?.toUpperCase();
    gstNumber = gstNumber?.toUpperCase();
    if (panNumber) {
      const isValid = isValidPAN(panNumber);
      const checkPan = isValid ? await User.findOne({ panNumber }) : null;
      if (!isValid || checkPan) {
        const message = !isValid
          ? "Invalid PAN number"
          : "PAN number already exists";
        return sendError(res, 400, message);
      }
    }
    if (gstNumber && isValidGSTIN(gstNumber)) {
      const checkGst = await Gst.findOne({ gstNumber: gstNumber });
      if (!checkGst) {
        const gst = new Gst({
          companyName,
          gstNumber,
          zipCode,
          user: brandVendor._id,
        });
        await gst.save();
        brandVendor.gst = gst._id;
      }
    }
    const newBrand = new Brand({
      name,
      slogan,
      companyName,
      companyEmail,
      whatsappNumber,
      panNumber,
      gstNumber,
      referMarketId,
      referMarketMobile,
      user: brandVendor._id,
      gst: gst,
      // location: location._id,
      // workHours: workingHours._id,
      // logo: brand.logo,
      // cover: brand.cover,
      // category: brand.category,
      // subCategory: brand.subCategory,
      // description: brand.description,
      // marketPermission: brand.marketPermission,
      // isActive: brand.isActive,
    });
    return sendSuccess(res, 201, "Brand added successfully", newBrand);
  } catch (error) {
    console.log("error on addBrand: ", error);
    return sendError(res, 500, error.message);
  }
};
