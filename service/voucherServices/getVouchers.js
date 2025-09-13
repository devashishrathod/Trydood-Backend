// const mongoose = require("mongoose");
// const Voucher = require("../../model/Voucher");

// exports.getVouchers = async (userId, query) => {
//   const {
//     brandId,
//     subBrandId,
//     categoryId,
//     subCategoryId,
//     status,
//     isPublished,
//     isActive,
//     validFrom,
//     validTill,
//     page = 1,
//     limit = 10,
//     sortBy = "createdAt",
//     sortOrder = "desc",
//     onlyLiked = false,
//   } = query;
//   const filter = { isDeleted: false };
//   if (brandId && mongoose.isValidObjectId(brandId)) {
//     filter.brand = new mongoose.Types.ObjectId(brandId);
//   }
//   if (subBrandId && mongoose.isValidObjectId(subBrandId)) {
//     filter.subBrands = new mongoose.Types.ObjectId(subBrandId);
//   }
//   if (categoryId && mongoose.isValidObjectId(categoryId)) {
//     filter.category = new mongoose.Types.ObjectId(categoryId);
//   }
//   if (subCategoryId && mongoose.isValidObjectId(subCategoryId)) {
//     filter.subCategory = new mongoose.Types.ObjectId(subCategoryId);
//   }
//   if (status) filter.status = status;
//   if (isPublished !== undefined) filter.isPublished = isPublished === "true";
//   if (isActive !== undefined) filter.isActive = isActive === "true";
//   if (validFrom || validTill) {
//     filter.validFrom = {};
//     if (validFrom) filter.validFrom.$gte = new Date(validFrom);
//     if (validTill) filter.validFrom.$lte = new Date(validTill);
//   }
//   const sortOption = { [sortBy]: sortOrder === "asc" ? 1 : -1 };
//   const skip = (parseInt(page) - 1) * parseInt(limit);
//   const pipeline = [
//     { $match: filter },
//     {
//       $lookup: {
//         from: "favoritevouchers",
//         let: { voucherId: "$_id" },
//         pipeline: [
//           {
//             $match: {
//               $expr: {
//                 $and: [
//                   { $eq: ["$voucher", "$$voucherId"] },
//                   { $eq: ["$user", new mongoose.Types.ObjectId(userId)] },
//                   { $eq: ["$isDeleted", false] },
//                 ],
//               },
//             },
//           },
//         ],
//         as: "userLiked",
//       },
//     },
//     {
//       $addFields: {
//         isLiked: {
//           $cond: [{ $gt: [{ $size: "$userLiked" }, 0] }, true, false],
//         },
//       },
//     },
//     ...(onlyLiked === "true" ? [{ $match: { isLiked: true } }] : []),
//     {
//       $lookup: {
//         from: "brands",
//         localField: "brand",
//         foreignField: "_id",
//         as: "brand",
//       },
//     },
//     { $unwind: { path: "$brand", preserveNullAndEmptyArrays: true } },
//     {
//       $lookup: {
//         from: "locations",
//         localField: "brand.location",
//         foreignField: "_id",
//         as: "brand.location",
//       },
//     },
//     {
//       $lookup: {
//         from: "subbrands",
//         localField: "subBrands",
//         foreignField: "_id",
//         as: "subBrands",
//       },
//     },
//     { $sort: sortOption },
//     {
//       $facet: {
//         vouchers: [{ $skip: skip }, { $limit: parseInt(limit) }],
//         totalCount: [{ $count: "count" }],
//       },
//     },
//     {
//       $addFields: {
//         total: { $ifNull: [{ $arrayElemAt: ["$totalCount.count", 0] }, 0] },
//       },
//     },
//   ];
//   const result = await Voucher.aggregate(pipeline);
//   return {
//     total: result[0]?.total || 0,
//     page: parseInt(page),
//     limit: parseInt(limit),
//     vouchers: result[0]?.vouchers || [],
//   };
// };

const mongoose = require("mongoose");
const Voucher = require("../../model/Voucher");

exports.getVouchers = async (userId, query) => {
  const {
    brandId,
    subBrandId,
    categoryId,
    subCategoryId,
    status,
    isPublished,
    isActive,
    validFrom,
    validTill,
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
    onlyLiked = false,
  } = query;
  const filter = { isDeleted: false };
  if (brandId && mongoose.isValidObjectId(brandId)) {
    filter.brand = new mongoose.Types.ObjectId(brandId);
  }
  if (subBrandId && mongoose.isValidObjectId(subBrandId)) {
    filter.subBrands = new mongoose.Types.ObjectId(subBrandId);
  }
  if (categoryId && mongoose.isValidObjectId(categoryId)) {
    filter.category = new mongoose.Types.ObjectId(categoryId);
  }
  if (subCategoryId && mongoose.isValidObjectId(subCategoryId)) {
    filter.subCategory = new mongoose.Types.ObjectId(subCategoryId);
  }
  if (status) filter.status = status;
  if (isPublished !== undefined) filter.isPublished = isPublished === "true";
  if (isActive !== undefined) filter.isActive = isActive === "true";
  if (validFrom || validTill) {
    filter.validFrom = {};
    if (validFrom) filter.validFrom.$gte = new Date(validFrom);
    if (validTill) filter.validFrom.$lte = new Date(validTill);
  }
  const sortOption = { [sortBy]: sortOrder === "asc" ? 1 : -1 };
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const pipeline = [
    { $match: filter },
    {
      $lookup: {
        from: "favoritevouchers",
        let: { voucherId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$voucher", "$$voucherId"] },
                  { $eq: ["$user", new mongoose.Types.ObjectId(userId)] },
                  { $eq: ["$isDeleted", false] },
                ],
              },
            },
          },
        ],
        as: "userLiked",
      },
    },
    {
      $addFields: {
        isLiked: {
          $cond: [{ $gt: [{ $size: "$userLiked" }, 0] }, true, false],
        },
      },
    },
    ...(onlyLiked === "true" ? [{ $match: { isLiked: true } }] : []),
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
        from: "locations",
        localField: "brand.location",
        foreignField: "_id",
        as: "brand.location",
      },
    },
    {
      $lookup: {
        from: "subbrands",
        let: { subBrandIds: "$subBrands" },
        pipeline: [
          { $match: { $expr: { $in: ["$_id", "$$subBrandIds"] } } },
          {
            $lookup: {
              from: "locations",
              localField: "location",
              foreignField: "_id",
              as: "location",
            },
          },
          {
            $lookup: {
              from: "bills",
              let: { sbId: "$_id" },
              pipeline: [
                { $match: { $expr: { $eq: ["$subBrandId", "$$sbId"] } } },
                {
                  $group: {
                    _id: null,
                    billValues: { $sum: "$billAmount" },
                    earnValues: { $sum: "$finalPayable" },
                  },
                },
              ],
              as: "billStats",
            },
          },
          {
            $addFields: {
              billValues: {
                $ifNull: [{ $arrayElemAt: ["$billStats.billValues", 0] }, 0],
              },
            },
          },
          {
            $addFields: {
              earnValues: {
                $ifNull: [{ $arrayElemAt: ["$billStats.earnValues", 0] }, 0],
              },
            },
          },
          {
            $lookup: {
              from: "refunds",
              let: { sbId: "$_id" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$subBrand", "$$sbId"] },
                        { $eq: ["$status", "APPROVED"] },
                        { $eq: ["$isDeleted", false] },
                      ],
                    },
                  },
                },
                {
                  $group: {
                    _id: null,
                    refundValues: { $sum: "$refundAmount" },
                  },
                },
              ],
              as: "refundStats",
            },
          },
          {
            $addFields: {
              refundValues: {
                $ifNull: [
                  { $arrayElemAt: ["$refundStats.refundValues", 0] },
                  0,
                ],
              },
            },
          },
        ],
        as: "subBrands",
      },
    },
    {
      $lookup: {
        from: "bills",
        let: { vId: "$_id" },
        pipeline: [
          { $match: { $expr: { $eq: ["$voucherId", "$$vId"] } } },
          {
            $group: {
              _id: null,
              invoices: { $sum: 1 },
              billValues: { $sum: "$billAmount" },
              earnValues: { $sum: "$finalPayable" },
            },
          },
        ],
        as: "voucherBillStats",
      },
    },
    {
      $addFields: {
        invoices: {
          $ifNull: [{ $arrayElemAt: ["$voucherBillStats.invoices", 0] }, 0],
        },
        billValues: {
          $ifNull: [{ $arrayElemAt: ["$voucherBillStats.billValues", 0] }, 0],
        },
        earnValues: {
          $ifNull: [{ $arrayElemAt: ["$voucherBillStats.earnValues", 0] }, 0],
        },
        outlets: { $size: "$subBrands" },
      },
    },
    {
      $lookup: {
        from: "refunds",
        let: { vId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$voucher", "$$vId"] },
                  { $eq: ["$status", "APPROVED"] },
                  { $eq: ["$isDeleted", false] },
                ],
              },
            },
          },
          { $group: { _id: null, refundValues: { $sum: "$refundAmount" } } },
        ],
        as: "voucherRefundStats",
      },
    },
    {
      $addFields: {
        refundValues: {
          $ifNull: [
            { $arrayElemAt: ["$voucherRefundStats.refundValues", 0] },
            0,
          ],
        },
      },
    },
    { $sort: sortOption },
    {
      $facet: {
        vouchers: [{ $skip: skip }, { $limit: parseInt(limit) }],
        totalCount: [{ $count: "count" }],
      },
    },
    {
      $addFields: {
        total: { $ifNull: [{ $arrayElemAt: ["$totalCount.count", 0] }, 0] },
      },
    },
  ];
  const result = await Voucher.aggregate(pipeline);
  return {
    total: result[0]?.total || 0,
    page: parseInt(page),
    limit: parseInt(limit),
    vouchers: result[0]?.vouchers || [],
  };
};
