const { sendSuccess, sendError } = require("../../utils");
const { getUserById, updateUserById } = require("../../service/userServices");
const {
  getBrandById,
  updateBrandById,
  getBrandWithAllDetails,
} = require("../../service/brandServices");
const {
  createSubscribed,
  getAllSubscribedByUserId,
} = require("../../service/subscribedServices");
const {
  getActiveSubscriptionPlanById,
} = require("../../service/subscriptionServices");
const { calculateEndDate } = require("../../helpers/subscribeds");
const { isOldUser } = require("../../helpers/users");
const { SUBSCRIPTION_PLANS } = require("../../constants");

exports.subscribeToCoolingPlan = async (req, res) => {
  try {
    const userId = req.payload?._id;
    const user = await getUserById(userId);
    if (!user) return sendError(res, 404, "User not found");

    const brand = await getBrandById(user?.brand);
    if (!brand) return sendError(res, 404, "Associated brand not found");

    const userSubscriptions = await getAllSubscribedByUserId(userId);
    if (userSubscriptions && userSubscriptions.length > 0) {
      return sendError(
        res,
        403,
        "Cooling plan is only available for first-time users"
      );
    }
    const reusedIdentity = await isOldUser(
      user?.email,
      user?.whatsappNumber,
      user?._id
    );
    if (reusedIdentity) {
      return sendError(
        res,
        403,
        "Cooling plan already used — phone or email linked to an existing or previously deleted account"
      );
    }
    const coolingPlan = await getActiveSubscriptionPlanById(
      SUBSCRIPTION_PLANS.FREE_COOLING_PLAN_ID
    );
    if (!coolingPlan) {
      return sendError(
        res,
        503,
        "Please Try again! Cooling plan not found or inactive"
      );
    }
    const startDate = new Date();
    const endDate = calculateEndDate(
      startDate,
      coolingPlan.durationInYears,
      coolingPlan.durationInDays
    );
    const subscribedData = {
      user: userId,
      brand: brand._id,
      subscribedBy: userId,
      transaction: null,
      subscription: coolingPlan._id,
      durationInYears: coolingPlan.durationInYears,
      durationInDays: coolingPlan.durationInDays,
      startDate,
      endDate,
      expiryDate: endDate,
      discount: coolingPlan.discount || 100,
      numberOfSubBrands: coolingPlan.numberOfSubBrands,
      price: 0,
      isCoolingPlan: true,
    };
    const createdSubscribed = await createSubscribed(subscribedData);
    const updateData = {
      subscribed: createdSubscribed._id,
      isSubscribed: true,
      currentScreen: "HOME_SCREEN",
      subBrandsLimit: coolingPlan.numberOfSubBrands,
      isOnBoardingCompleted: true,
    };
    await updateUserById(userId, updateData);
    await updateBrandById(brand._id, updateData);
    const SubscribedBrand = await getBrandWithAllDetails(brand);
    return sendSuccess(res, 200, "Cooling plan activated successfully", {
      brand: SubscribedBrand,
    });
  } catch (err) {
    console.error("Cooling Plan Subscription Error:", err);
    return sendError(res, 500, err.message || "Server error");
  }
};
