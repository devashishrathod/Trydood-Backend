const { sendError, sendSuccess } = require("../../utils");
const { getCategoryById } = require("../../service/categoryServices");
const { getBrandByUserAndVendorId } = require("../../service/brandServices");
const { getSubCategoryById } = require("../../service/subCategoryServices");
const { getUserByFields } = require("../../service/userServices");
const {
  createWorkHours,
  getWorkHoursByUserAndBrandId,
} = require("../../service/workHoursServices");
const {
  createLacation,
  getLocationByUserAndBrandId,
} = require("../../service/locationServices");

// Update Brand Details
exports.updateBrand = async (req, res) => {
  try {
    const brandId = req.params?.id;
    const userId = req.payload?._id;
    const checkVendor = await getUserByFields({
      _id: userId,
      isDeleted: false,
    });
    if (!checkVendor) return sendError(res, 404, "Vendor not found!");
    const checkBrand = await getBrandByUserAndVendorId(brandId, userId);
    if (!checkBrand) return sendError(res, 404, "No brand found!");
    const {
      categoryId,
      subCategoryId,
      shopOrBuildingNumber,
      address,
      area,
      city,
      state,
      pinCode,
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
      currentScreen,
      isOnBoardingCompleted,
    } = req.body;
    /** ----------- Update Category/Subcategory ------------ */
    if (categoryId || subCategoryId) {
      const checkCategory = await getCategoryById(categoryId);
      if (!checkCategory) {
        return await sendError(res, 404, "Category not found!");
      }
      checkBrand.category = categoryId;
      const checkSubCategory = await getSubCategoryById(subCategoryId);
      if (!checkSubCategory) {
        return await sendError(res, 404, "Sub-Category not found!");
      }
      checkBrand.subCategory = subCategoryId;
    }
    /** ----------- Update/Add Location ------------ */
    if (
      shopOrBuildingNumber ||
      address ||
      area ||
      city ||
      state ||
      pinCode ||
      landMark ||
      lat ||
      lng
    ) {
      if ((lat && !lng) || (!lat && lng)) {
        return sendError(res, 409, "Both latitude and longitude are required.");
      }
      let checkLocation = await getLocationByUserAndBrandId(brandId, userId);
      const locationData = {
        shopOrBuildingNumber,
        address,
        area,
        city,
        state,
        pinCode,
        landMark,
      };
      if (
        lat !== undefined &&
        lng !== undefined &&
        !isNaN(lat) &&
        !isNaN(lng)
      ) {
        locationData.location = {
          type: "Point",
          coordinates: [parseFloat(lng), parseFloat(lat)],
        };
      }
      if (checkLocation) {
        Object.entries(locationData).forEach(([key, value]) => {
          if (value !== undefined) checkLocation[key] = value;
        });
        await checkLocation.save();
      } else {
        const newLocation = await createLacation({
          user: userId,
          brand: brandId,
          ...locationData,
        });
        checkBrand.location = newLocation._id;
        checkVendor.location = newLocation._id;
      }
    }
    /** ----------- Update/Add Working Hours ------------ */
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
      let checkWorking = await getWorkHoursByUserAndBrandId(brandId, userId);
      if (checkWorking) {
        Object.entries(parsedWorking).forEach(([day, value]) => {
          checkWorking[day] = value;
        });
        await checkWorking.save();
      } else {
        const newWorking = await createWorkHours({
          user: userId,
          brand: brandId,
          ...parsedWorking,
        });
        checkBrand.workHours = newWorking._id;
      }
    }
    if (currentScreen) {
      checkBrand.currentScreen = currentScreen;
      checkVendor.currentScreen = currentScreen;
    }
    if (isOnBoardingCompleted) {
      checkBrand.isOnBoardingCompleted = isOnBoardingCompleted;
      checkVendor.isOnBoardingCompleted = isOnBoardingCompleted;
    }
    const updatedBrand = await checkBrand.save();
    const updatedUser = await checkVendor.save();
    return sendSuccess(
      res,
      200,
      "Brand and Vendor details updated successfully.",
      {
        brand: updatedBrand,
        user: updatedUser,
      }
    );
  } catch (error) {
    console.log("Error in updateBrandDetails:", error);
    return sendError(res, 500, error.message);
  }
};
