const mongoose = require("mongoose");
const Transaction = require("../../model/Transaction");

exports.getClaimedVouchersByUser = async (filter) => {
  let { page, limit, userId, brandId, subBrandId, startDate, endDate, date } =
    filter;
  page = page ? parseInt(page) : 1;
  limit = limit ? parseInt(limit) : 10;
  const skip = (page - 1) * limit;
  const matchData = { isDeleted: false, isActive: true };
  if (userId) matchData.user = new mongoose.Types.ObjectId(userId);
  if (brandId) matchData.brand = new mongoose.Types.ObjectId(brandId);
  if (subBrandId) matchData.subBrand = new mongoose.Types.ObjectId(subBrandId);
  if (startDate && endDate) {
    matchData.createdAt = {
      $gte: new Date(new Date(startDate).setHours(0, 0, 0, 0)),
      $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)),
    };
  } else if (date) {
    matchData.createdAt = {
      $gte: new Date(new Date(date).setHours(0, 0, 0, 0)),
      $lte: new Date(new Date(date).setHours(23, 59, 59, 999)),
    };
  }
  const result = await Transaction.aggregate([
    { $match: matchData },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "brands",
        localField: "brand",
        foreignField: "_id",
        as: "brand",
      },
    },
    { $unwind: { path: "$brand", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "subbrands",
        localField: "subBrand",
        foreignField: "_id",
        as: "subBrand",
      },
    },
    { $unwind: { path: "$subBrand", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "categories",
        localField: "subBrand.category",
        foreignField: "_id",
        as: "category",
      },
    },
    { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "locations",
        localField: "subBrand.location",
        foreignField: "_id",
        as: "location",
      },
    },
    { $unwind: { path: "$location", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "bills",
        localField: "bill",
        foreignField: "_id",
        as: "bill",
      },
    },
    { $unwind: { path: "$bill", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "vouchers",
        localField: "bill.voucherId",
        foreignField: "_id",
        as: "voucher",
      },
    },
    { $unwind: { path: "$voucher", preserveNullAndEmptyArrays: true } },
    {
      $addFields: {
        day: {
          $let: {
            vars: {
              daysOfWeek: [
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
              ],
            },
            in: {
              $arrayElemAt: [
                "$$daysOfWeek",
                { $subtract: [{ $dayOfWeek: "$createdAt" }, 1] },
              ],
            },
          },
        },
        datePart: { $dateToString: { format: "%d-%b-%Y", date: "$createdAt" } },
        minutePart: { $dateToString: { format: "%M", date: "$createdAt" } },
        hour24: { $hour: "$createdAt" },
      },
    },
    {
      $addFields: {
        ampm: { $cond: [{ $gte: ["$hour24", 12] }, "PM", "AM"] },
        hourFormatted: {
          $cond: [
            { $eq: [{ $mod: ["$hour24", 12] }, 0] },
            12,
            { $mod: ["$hour24", 12] },
          ],
        },
      },
    },
    {
      $addFields: {
        formattedDate: {
          $concat: [
            "$datePart",
            " - ",
            { $toString: "$hourFormatted" },
            ":",
            "$minutePart",
            " ",
            "$ampm",
          ],
        },
      },
    },
    { $sort: { createdAt: -1 } },
    {
      $project: {
        _id: 0,
        userName: "$user.name",
        userProfilePic: "$user.image",
        orderId: "$razorpayOrderId",
        dateTime: "$formattedDate",
        day: "$day",
        category: "$category.name",
        percentage: "$voucher.discount",
        price: { $ifNull: ["$paidAmount", "$bill.finalPayble"] },
        voucherType: {
          $cond: [
            { $eq: ["$voucher.isActive", true] },
            "In store",
            "Out of stock",
          ],
        },
        claimedType: "$paymentMethod",
        transactionId: "$_id",
        paymentStatus: {
          $cond: [{ $eq: ["$status", "captured"] }, "Success", "Failed"],
        },
        invoiceId: "$invoiceId",
        invoiceUrl: "$invoiceUrl",
        subBrandAdd: "$location.address",
        subBrandShopNumber: "$location.shopOrBuildingNumber",
        subBrandCity: "$location.city",
        brandName: "$subBrand.companyName",
        brandUniqueId: "$brand.uniqueId",
        subBrandUniqueId: "$subBrand.uniqueId",
        billSummary: {
          voucherDiscountValue: "$bill.voucherDiscountValue",
          billAmount: "$bill.billAmount",
          appliedOffers: "$bill.appliedOffers",
          convenienceFee: "$bill.convenienceFee",
          totalDiscountValue: "$bill.totalDiscountValue",
          finalPayable: "$bill.finalPayable",
          isVerified: "$bill.isVerified",
          isDeleted: "$bill.isDeleted",
          createdAt: "$bill.createdAt",
        },
      },
    },
    {
      $facet: {
        data: [{ $skip: skip }, { $limit: limit }],
        totalCount: [{ $count: "total" }],
      },
    },
    {
      $addFields: {
        total: { $ifNull: [{ $arrayElemAt: ["$totalCount.total", 0] }, 0] },
        totalPage: {
          $ceil: {
            $divide: [
              { $ifNull: [{ $arrayElemAt: ["$totalCount.total", 0] }, 0] },
              limit,
            ],
          },
        },
        limit: limit,
        page: page,
      },
    },
    {
      $project: { total: 1, totalPage: 1, limit: 1, page: 1, data: 1 },
    },
  ]);
  return (
    result[0] || {
      total: 0,
      totalPage: 0,
      limit,
      page,
      data: [],
    }
  );
};
