const mongoose = require("mongoose");
const Transaction = require("../../model/Transaction");

exports.getClaimedVouchersByUser = async (userId, filter) => {
  const page = parseInt(filter.page) || 1;
  const limit = parseInt(filter.limit) || 10;
  const skip = (page - 1) * limit;

  const result = await Transaction.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        isDeleted: false,
        isActive: true,
      },
    },
    {
      $lookup: {
        from: "subbrands",
        localField: "subBrand",
        foreignField: "_id",
        as: "subBrand",
      },
    },
    { $unwind: "$subBrand" },
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
        localField: "bill.voucher",
        foreignField: "_id",
        as: "voucher",
      },
    },
    { $unwind: { path: "$voucher", preserveNullAndEmptyArrays: true } },
    {
      $addFields: {
        formattedDate: {
          $dateToString: {
            format: "%d - %b - %Y - %I:%M %p",
            date: "$createdAt",
          },
        },
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
              $arrayElemAt: ["$$daysOfWeek", { $dayOfWeek: "$createdAt" }],
            },
          },
        },
      },
    },
    {
      $project: {
        // _id: 0,
        orderId: "$razorpayOrderId",
        dateTime: "$formattedDate",
        day: "$day",
        category: "$category.name",
        percentage: "$voucher.discount",
        price: {
          $ifNull: ["$paidAmount", "$bill.finalPayble"],
        },
        voucherType: "$voucher.isActive",
        claimedType: "$paymentMethod",
        transactionId: "$_id",
        paymentStatus: "$status",
        invoiceUrl: "$invoiceUrl",
        subBrandAdd: "$subBrand.location.address",
        brandName: "$subBrand.companyName",
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
        total: { $arrayElemAt: ["$totalCount.total", 0] },
      },
    },
    {
      $addFields: {
        total: { $ifNull: ["$total", 0] },
        totalPage: {
          $ceil: {
            $divide: [{ $ifNull: ["$total", 0] }, limit],
          },
        },
        limit: limit,
        page: page,
      },
    },
    {
      $project: {
        data: 1,
        total: 1,
        totalPage: 1,
        limit: 1,
        page: 1,
      },
    },
  ]);
  return (
    result[0] || {
      data: [],
      total: 0,
      totalPage: 0,
      limit,
      page,
    }
  );
};
