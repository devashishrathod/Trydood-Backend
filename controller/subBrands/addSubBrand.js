const { ROLES } = require("../../constants");
const { sendError, sendSuccess, generateReferralCode } = require("../../utils");
const { getSubscribedById } = require("../../service/subscribedServices");
const { createWorkHours } = require("../../service/workHoursServices");
const {
  createUser,
  updateUserById,
  getUserByFields,
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
  getSubBrandWithAllDetails,
  // getAllSubBrandsOfOneBrand,
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
    // const vendorSubBrandsLimit = checkBrand?.subBrandsLimit;
    // const existingSubBrands = await getAllSubBrandsOfOneBrand(brandId);
    // if (existingSubBrands && existingSubBrands?.length !== 0) {
    //   if (vendorSubBrandsLimit == existingSubBrands.length) {
    if (!checkBrand?.isSubscribed) {
      return sendError(
        res,
        403,
        "Access denied. This feature requires an active subscription. Please subscribe to continue."
      );
    } else {
      const currentSubscribed = await getSubscribedById(checkBrand?.subscribed);
      if (currentSubscribed && currentSubscribed?.isExpired) {
        return sendError(
          res,
          403,
          "Your subscription has expired. Please renew or upgrade your plan to continue using this feature."
        );
      }
    }
    const { subBrandsLimit, subBrandsUsed } = checkBrand;
    if (subBrandsLimit == subBrandsUsed) {
      sendError(
        res,
        403,
        "Sub-brand Limit Exceeded! You have reached the maximum number of sub-brands allowed under your current plan. Please upgrade your subscription to add more sub-brands."
      );
    }
    let subBrandUserId = null;
    let subBrandUser = null;
    const checkRole = req?.payload?.role;
    if (checkRole == ROLES.SUB_VENDOR) {
      subBrandUserId = brandOrSubBrandVendor?._id;
      brandOrSubBrandVendor.brand = brandId;
      brandOrSubBrandVendor.save();
    } else {
      let existingSubBrandWithMobile = null;
      const mobile = brandOrSubBrandVendor?.mobile;
      if (mobile) {
        existingSubBrandWithMobile = await getUserByFields({
          whatsappNumber: mobile,
          role: ROLES.SUB_VENDOR,
        });
      }
      const whatsappNumber = brandOrSubBrandVendor?.whatsappNumber;
      if (whatsappNumber) {
        existingSubBrandWithMobile = await getUserByFields({
          whatsappNumber: whatsappNumber,
          role: ROLES.SUB_VENDOR,
        });
      }
      if (existingSubBrandWithMobile) {
        return sendError(
          res,
          404,
          "You are already registered a sub-brand with this mobile number! Please change mobile number and register again"
        );
      }
      const subBrandUserData = {
        brand: brandOrSubBrandVendor?._id,
        subBrands: undefined,
        companyEmail: brandOrSubBrandVendor?.companyEmail,
        role: ROLES.SUB_VENDOR,
        whatsappNumber: brandOrSubBrandVendor?.mobile,
        uniqueId: await generateUniqueUserId(),
        referCode: generateReferralCode(6),
        isMobileVerified: true,
      };
      subBrandUser = await createUser(subBrandUserData);
      subBrandUserId = subBrandUser?._id;
    }
    let errorMsg = null;
    if (
      !brandOrSubBrandVendor ||
      (brandOrSubBrandVendor?.role !== ROLES.VENDOR &&
        brandOrSubBrandVendor?.role !== ROLES.SUB_VENDOR) ||
      !brandOrSubBrandVendor?.isMobileVerified ||
      !brandOrSubBrandVendor?.brand
    ) {
      if (!brandOrSubBrandVendor) {
        errorMsg = "Access denied. Yendor or Sub-Vendor not found.";
      } else if (
        brandOrSubBrandVendor?.role !== ROLES.VENDOR &&
        brandOrSubBrandVendor?.role !== ROLES.SUB_VENDOR
      ) {
        errorMsg =
          "Access restricted. Only vendor and their Sub-vendors can perform this action.";
      } else if (!brandOrSubBrandVendor?.isMobileVerified) {
        errorMsg = "Please verify your mobile number to proceed.";
      } else if (!brandOrSubBrandVendor?.brand) {
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
      monday,
      tuesday,
      wednesday,
      thursday,
      friday,
      saturday,
      sunday,
    } = req.body;

    /** ----------- Add Location ------------ */

    if ((lat && !lng) || (!lat && lng)) {
      return sendError(res, 409, "Both latitude and longitude are required.");
    }
    let checkLocation = await getLocationByBrandAndSubBrandAddress(
      brandId,
      subBrandUserId,
      shopOrBuildingNumber?.toLowerCase()
    );
    if (checkLocation) {
      return sendError(res, 409, "This outlet location already exist.");
    }
    const locationData = {
      shopOrBuildingNumber: shopOrBuildingNumber?.toLowerCase(),
      address: address?.toLowerCase(),
      area: area?.toLowerCase(),
      city: city?.toLowerCase(),
      state: state?.toLowerCase(),
      country: country?.toLowerCase(),
      zipCode: zipCode?.toLowerCase(),
      landMark: landMark?.toLowerCase(),
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
    //  subBrandUser.location = newSubBrandLocation?._id;
    /** ----------- Update/Add Working Hours ------------ */
    let newWorking;
    const workingFields = {
      monday,
      tuesday,
      wednesday,
      thursday,
      friday,
      saturday,
      sunday,
    };
    const hasWorkingFields = Object.values(workingFields).some(
      (v) => v !== undefined
    );
    if (hasWorkingFields) {
      const parsedWorking = {};
      for (const [day, val] of Object.entries(workingFields)) {
        if (val !== undefined) {
          parsedWorking[day] = typeof val === "string" ? JSON.parse(val) : val;
        }
      }
      newWorking = await createWorkHours({
        user: subBrandUserId,
        brand: brandId,
        ...parsedWorking,
      });
      //   subBrandUser.workHours = newWorking._id;
    }
    const subBrandData = {
      companyName: companyName
        ? companyName?.toLowerCase()
        : checkBrand?.companyName,
      companyEmail: companyEmail
        ? companyEmail?.toLowerCase()
        : checkBrand?.email,
      whatsappNumber: whatsappNumber
        ? whatsappNumber?.toLowerCase()
        : brandOrSubBrandVendor?.mobile,
      user: subBrandUserId,
      brand: brandId,
      location: newSubBrandLocation?._id,
      workHours: newWorking._id,
      uniqueId: await generateUniqueSubBrandId(),
      currentScreen: currentScreen?.toUpperCase(),
      isSignUpCompleted: true,
    };
    const newSubBrand = await createSubBrand(subBrandData);
    if (!newSubBrand) {
      return sendError(res, 400, "Sub brand not added! try again");
    }
    await updateLocationByFields(
      { brand: brandId, user: subBrandUserId, isDeleted: false },
      { subBrand: newSubBrand?._id }
    );
    //  newSubBrandLocation.subBrand = newSubBrand?._id;
    await addSubBrandsToBrand(brandId, newSubBrand?._id);
    await addSubBrandsToBrandUser(checkBrand?.user, newSubBrand?._id);
    await updateUserById(subBrandUserId, {
      brand: brandId,
      subBrand: newSubBrand?._id,
      location: newSubBrandLocation?._id,
      workHours: newWorking._id,
      currentScreen: currentScreen?.toUpperCase(),
      subBrands: undefined,
      isSignUpCompleted: true,
    });
    const updatedSubBrand = await getSubBrandWithAllDetails(newSubBrand?._id);
    return sendSuccess(res, 201, "Sub Brand added successfully", {
      subBrand: updatedSubBrand,
    });
  } catch (error) {
    console.log("error on addBrand: ", error);
    return sendError(res, 500, error.message);
  }
};
