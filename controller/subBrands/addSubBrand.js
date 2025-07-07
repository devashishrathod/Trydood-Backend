const { ROLES } = require("../../constants");
const { sendError, sendSuccess, generateReferralCode } = require("../../utils");
const {
  createUser,
  updateUserById,
  generateUniqueUserId,
  addSubBrandsToBrandUser,
} = require("../../service/userServices");
const {
  createLacation,
  getLocationByBrandAndSubBrandAddress,
  updateLocationByFields,
} = require("../../service/locationServices");
const {
  createSubBrand,
  generateUniqueSubBrandId,
} = require("../../service/subBrandServices");
const {
  addSubBrandsToBrand,
  getBrandById,
} = require("../../service/brandServices");

// Add Sub-Vendor brand by Original/Head Brand Vendor
exports.addSubBrand = async (req, res) => {
  try {
    const brandOrSubBrandVendor = req?.payload;
    const brandId = req?.params?.brandId;
    const checkBrand = await getBrandById(brandId);
    if (!checkBrand) return sendError(res, 404, "Brand not found!");
    let subBrandUserId = null;
    const checkRole = req?.payload?.role;
    if (checkRole == ROLES.SUB_VENDOR) {
      subBrandUserId = brandOrSubBrandVendor._id;
      brandOrSubBrandVendor.brand = brandId;
      brandOrSubBrandVendor.save();
    } else {
      const subBrandUserData = {
        brand: brandOrSubBrandVendor._id,
        subBrands: undefined,
        email: brandOrSubBrandVendor.email,
        role: ROLES.SUB_VENDOR,
        whatsappNumber: brandOrSubBrandVendor.whatsappNumber,
        uniqueId: await generateUniqueUserId(),
        referCode: generateReferralCode(6),
        isMobileVerified: true,
      };
      const subBrandUser = await createUser(subBrandUserData);
      subBrandUserId = subBrandUser._id;
    }
    let errorMsg = null;
    if (
      !brandOrSubBrandVendor ||
      (brandOrSubBrandVendor.role !== ROLES.VENDOR &&
        brandOrSubBrandVendor.role !== ROLES.SUB_VENDOR) ||
      !brandOrSubBrandVendor.isMobileVerified ||
      !brandOrSubBrandVendor.brand
    ) {
      if (!brandOrSubBrandVendor) {
        errorMsg = "Access denied. Yendor or Sub-Vendor not found.";
      } else if (
        brandOrSubBrandVendor.role !== ROLES.VENDOR &&
        brandOrSubBrandVendor.role !== ROLES.SUB_VENDOR
      ) {
        errorMsg =
          "Access restricted. Only vendor and their Sub-vendors can perform this action.";
      } else if (!brandOrSubBrandVendor.isMobileVerified) {
        errorMsg = "Please verify your mobile number to proceed.";
      } else if (!brandOrSubBrandVendor.brand) {
        errorMsg =
          "You have not authorized to add sub-brand! Please first register your head brand";
      }
      return sendError(res, 403, errorMsg);
    }
    let {
      companyName,
      companyEmail,
      whatsappNumber,
      currentScreen,
      shopOrBuildingNumber,
      address,
      area,
      city,
      state,
      country,
      zipCode,
      landMark,
      lat,
      lng,
    } = req.body;

    /** ----------- Add Location ------------ */

    if ((lat && !lng) || (!lat && lng)) {
      return sendError(res, 409, "Both latitude and longitude are required.");
    }
    let checkLocation = await getLocationByBrandAndSubBrandAddress(
      brandId,
      subBrandUserId,
      shopOrBuildingNumber
    );
    if (checkLocation) {
      return sendError(res, 409, "This outlet location already exist.");
    }
    const locationData = {
      shopOrBuildingNumber,
      address,
      area,
      city,
      state,
      country,
      zipCode,
      landMark,
    };
    if (lat !== undefined && lng !== undefined && !isNaN(lat) && !isNaN(lng)) {
      locationData.location = {
        type: "Point",
        coordinates: [parseFloat(lng), parseFloat(lat)],
      };
    }
    const newSubBrandLocation = await createLacation({
      brand: brandId,
      user: subBrandUserId,
      ...locationData,
    });
    const subBrandData = {
      companyName: companyName
        ? companyName
        : brandOrSubBrandVendor?.companyName,
      companyEmail: companyEmail ? companyEmail : brandOrSubBrandVendor?.email,
      whatsappNumber: whatsappNumber,
      user: subBrandUserId,
      brand: brandId,
      location: newSubBrandLocation._id,
      uniqueId: await generateUniqueSubBrandId(),
      currentScreen: currentScreen,
      isSignUpCompleted: true,
    };
    const newSubBrand = await createSubBrand(subBrandData);
    if (newSubBrand) {
      console.log("newSubBrand", newSubBrand);
      await updateLocationByFields(
        { brand: brandId, user: subBrandUserId, isDeleted: false },
        { subBrand: newSubBrand._id }
      );
      newSubBrandLocation.subBrand = newSubBrand._id;
      const updateBrandWithAddSubBrands = await addSubBrandsToBrand(
        brandId,
        newSubBrand._id
      );
      console.log(
        "updateBrandWithAddSubBrands",
        brandId,
        updateBrandWithAddSubBrands
      );
      const updateVendorUser = await addSubBrandsToBrandUser(
        checkBrand.user,
        newSubBrand._id
      );
      console.log("updateVendorUser", checkBrand.user, updateVendorUser);
      const updatedSubBrandUser = await updateUserById(subBrandUserId, {
        brand: brandId,
        subBrand: newSubBrand._id,
        location: newSubBrandLocation._id,
        currentScreen: currentScreen,
        subBrands: undefined,
        isSignUpCompleted: true,
      });
      console.log("updatedSubBrandUser", updatedSubBrandUser);
      return sendSuccess(res, 201, "Sub Brand added successfully", {
        brand: updateBrandWithAddSubBrands,
        brandUser: updateVendorUser,
        subBrand: newSubBrand,
        subBrandUser: updatedSubBrandUser,
      });
    }
    return sendError(res, 400, "Sub brand not added! try again");
  } catch (error) {
    console.log("error on addBrand: ", error);
    return sendError(res, 500, error.message);
  }
};
