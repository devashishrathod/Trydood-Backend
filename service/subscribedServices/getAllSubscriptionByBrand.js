const Subscribed = require("../../model/Subscribed");

exports.getAllSubscriptionByBrand = async (brandId) => {
  return await Subscribed.find({ brand: brandId, isDeleted: false })
    .populate("transaction")
    .sort({ createdAt: -1 });
};
