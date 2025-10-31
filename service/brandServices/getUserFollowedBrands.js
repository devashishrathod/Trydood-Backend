const mongoose = require("mongoose");
const Follow = require("../../model/Follow");
const { throwError } = require("../../utils");

function escapeRegex(s = "") {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

exports.getUserFollowedBrands = async (userId, filter) => {
  let { page = 1, limit = 10, search = "" } = filter;
  const _page = Math.max(parseInt(page, 10) || 1, 1);
  const _limit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
  const skip = (_page - 1) * _limit;
  const hasSearch = !!search?.trim();
  const searchPattern = hasSearch
    ? new RegExp(escapeRegex(search.trim()), "i")
    : null;
  const pipeline = [
    {
      $match: {
        follower: new mongoose.Types.ObjectId(userId),
        isDeleted: false,
      },
    },
    {
      $lookup: {
        from: "brands",
        let: { bid: "$followee" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$_id", "$$bid"] },
                  { $eq: ["$isDeleted", false] },
                  { $eq: ["$isActive", true] },
                ],
              },
            },
          },
          {
            $project: {
              name: 1,
              category: 1,
              subCategory: 1,
              logo: 1,
              uniqueId: 1,
              createdAt: 1,
            },
          },
        ],
        as: "brand",
      },
    },
    { $unwind: "$brand" },
    {
      $lookup: {
        from: "categories",
        localField: "brand.category",
        foreignField: "_id",
        pipeline: [{ $project: { name: 1 } }],
        as: "category",
      },
    },
    { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "subcategories",
        localField: "brand.subCategory",
        foreignField: "_id",
        pipeline: [{ $project: { name: 1 } }],
        as: "subCategory",
      },
    },
    { $unwind: { path: "$subCategory", preserveNullAndEmptyArrays: true } },
    ...(hasSearch
      ? [
          {
            $match: {
              $or: [
                { "brand.name": { $regex: searchPattern } },
                { "category.name": { $regex: searchPattern } },
                { "subCategory.name": { $regex: searchPattern } },
              ],
            },
          },
        ]
      : []),
    { $sort: { "brand.name": 1, _id: -1 } },
    {
      $project: {
        _id: 0,
        brandId: "$brand._id",
        brandName: "$brand.name",
        brandLogo: "$brand.logo",
        brandUniqueId: "$brand.uniqueId",
        brandJoinDate: "$brand.createdAt",
        categoryName: "$category.name",
        subCategoryName: "$subCategory.name",
      },
    },
    {
      $facet: {
        data: [{ $skip: skip }, { $limit: _limit }],
        totalDocs: [{ $count: "count" }],
      },
    },
    {
      $addFields: {
        total: { $ifNull: [{ $arrayElemAt: ["$totalDocs.count", 0] }, 0] },
      },
    },
    { $project: { total: 1, data: 1 } },
  ];
  const [res] = await Follow.aggregate(pipeline);
  if (!res?.data?.length) throwError(404, "Not any following yet");
  return {
    total: res?.total || 0,
    page: _page,
    limit: _limit,
    data: res?.data || [],
  };
};
