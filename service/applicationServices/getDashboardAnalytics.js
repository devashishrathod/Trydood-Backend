const Bill = require("../../model/Bill");
const Refund = require("../../model/Refund");
const Transaction = require("../../model/Transaction");
const User = require("../../model/User");
const Brand = require("../../model/Brand");
const SubBrand = require("../../model/SubBrand");
const Subscribed = require("../../model/Subscribed");
const Voucher = require("../../model/Voucher");
const { REFUND_STATUS } = require("../../constants");

const buildMatchQuery = ({ brandId, subBrandId, startDate, endDate, date }) => {
  const match = { isDeleted: { $ne: true } };
  if (brandId) match.brandId = brandId;
  if (subBrandId) match.subBrandId = subBrandId;
  if (date) {
    match.createdAt = {
      $gte: new Date(date),
      $lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1)),
    };
  } else if (startDate && endDate) {
    match.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }
  return match;
};

exports.getDashboardAnalytics = async (filters = {}) => {
  const matchQuery = buildMatchQuery(filters);
  const billAgg = await Bill.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: null,
        billValues: { $sum: "$billAmount" },
        earnValues: { $sum: "$finalPayable" },
        billProfits: { $sum: "$totalDiscountValue" },
        claimedCount: { $sum: 1 },
      },
    },
  ]);
  const refundAgg = await Refund.aggregate([
    {
      $match: {
        ...matchQuery,
        status: REFUND_STATUS.APPROVED,
        isApproved: true,
      },
    },
    {
      $group: {
        _id: null,
        refundValue: { $sum: "$refundAmount" },
        refundCount: { $sum: 1 },
      },
    },
  ]);
  const txnAgg = await Transaction.aggregate([
    {
      $match: {
        ...matchQuery,
        bill: { $exists: true, $ne: null },
      },
    },
    {
      $group: {
        _id: null,
        overallTransaction: { $sum: "$paidAmount" },
      },
    },
  ]);
  const [overallUsers, brands, subBrands, vouchers, subscriptionAgg] =
    await Promise.all([
      User.countDocuments(),
      Brand.countDocuments(),
      SubBrand.countDocuments(
        filters.brandId ? { brandId: filters.brandId } : {}
      ),
      Voucher.countDocuments(),
      Subscribed.aggregate([
        { $match: filters.brandId ? { brandId: filters.brandId } : {} },
        { $group: { _id: null, subscriptionAmount: { $sum: "$price" } } },
      ]),
    ]);
  return {
    billValues: billAgg[0]?.billValues || 0,
    earnValues: billAgg[0]?.earnValues || 0,
    billProfits: billAgg[0]?.billProfits || 0,
    claimedCount: billAgg[0]?.claimedCount || 0,
    refundValue: refundAgg[0]?.refundValue || 0,
    refundCount: refundAgg[0]?.refundCount || 0,
    overallTransaction: txnAgg[0]?.overallTransaction || 0,
    overallUsers,
    brands,
    subBrands,
    vouchers,
    subscriptionAmount: subscriptionAgg[0]?.subscriptionAmount || 0,
  };
};
