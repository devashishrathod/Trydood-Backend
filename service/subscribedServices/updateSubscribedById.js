const Subscribed = require("../../model/Subscribed");
const { findOneAndUpdate } = require("../../db/dbServices");
const { getSubscribedById } = require("./getSubscribedById");

exports.updateSubscribedById = async (subscribedId, updatedData) => {
  const now = new Date();

  const subscribed = await getSubscribedById(subscribedId);
  if (!subscribed) throw new Error("Subscribed document not found");

  const isFirstUpgrade =
    !subscribed.previousPlans || subscribed.previousPlans.length === 0;

  const previousPlanEntry = {
    subscription: subscribed?.subscription,
    transaction: subscribed?.transaction,
    startDate: subscribed?.startDate,
    endDate: subscribed?.endDate,
    upgradeDate: now,
    paidAmount: subscribed?.paidAmount,
    price: subscribed?.price,
    discount: subscribed?.discount,
    numberOfSubBrands: subscribed?.numberOfSubBrands,
    dueAmount: subscribed?.dueAmount,
    subscribedBy: isFirstUpgrade
      ? subscribed.subscribedBy
      : subscribed.upgradedBy,
  };
  return await findOneAndUpdate(
    Subscribed,
    { _id: subscribedId, isDeleted: false, isActive: true },
    {
      $push: { previousPlans: previousPlanEntry },
      $set: {
        ...updatedData,
        upgradeDate: now,
        isUpgraded: true,
      },
      $inc: { numberOfUpgrade: 1 },
    }
  );
};
