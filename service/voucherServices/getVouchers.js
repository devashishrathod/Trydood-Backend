// const mongoose = require("mongoose");
// const Voucher = require("../../model/Voucher");

// exports.getVouchers = async (query) => {
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
//   } = query;
//   const filter = { isDeleted: false };
//   if (brandId && mongoose.isValidObjectId(brandId)) {
//     filter.brand = new mongoose.Types.ObjectId(brandId.toString());
//   }
//   if (subBrandId && mongoose.isValidObjectId(subBrandId)) {
//     filter.subBrands = new mongoose.Types.ObjectId(subBrandId.toString());
//   }
//   if (categoryId && mongoose.isValidObjectId(categoryId)) {
//     filter.category = new mongoose.Types.ObjectId(categoryId.toString());
//   }
//   if (subCategoryId && mongoose.isValidObjectId(subCategoryId)) {
//     filter.subCategory = new mongoose.Types.ObjectId(subCategoryId.toString());
//   }
//   if (status) filter.status = status;
//   if (isPublished !== undefined) filter.isPublished = isPublished === "true";
//   if (isActive !== undefined) filter.isActive = isActive === "true";
//   if (validFrom || validTill) {
//     filter.validFrom = {};
//     if (validFrom) filter.validFrom.$gte = new Date(validFrom);
//     if (validTill) filter.validFrom.$lte = new Date(validTill);
//   }
//   const sortOption = {
//     [sortBy]: sortOrder === "asc" ? 1 : -1,
//   };
//   const skip = (parseInt(page) - 1) * parseInt(limit);
//   const [vouchers, total] = await Promise.all([
//     Voucher.find(filter)
//       .populate({
//         path: "brand",
//         populate: { path: "location" },
//       })
//       .populate("subBrands")
//       .sort(sortOption)
//       .skip(skip)
//       .limit(parseInt(limit)),
//     Voucher.countDocuments(filter),
//   ]);
//   return {
//     total,
//     page: parseInt(page),
//     limit: parseInt(limit),
//     vouchers,
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
        localField: "subBrands",
        foreignField: "_id",
        as: "subBrands",
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
