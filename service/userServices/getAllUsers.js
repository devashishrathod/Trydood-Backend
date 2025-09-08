const { ROLES } = require("../../constants");
const User = require("../../model/User");

exports.getAllUsers = async (query) => {
  let { page, limit, uniqueId } = query;
  page = parseInt(query.page) || 1;
  limit = parseInt(query.limit) || 10;
  const skip = (page - 1) * limit;
  const match = { isDeleted: false, role: ROLES.USER };
  if (uniqueId) match.uniqueId = uniqueId;
  if (query.isActive !== undefined) match.isActive = query.isActive === "true";
  const pipeline = [
    { $match: match },
    {
      $lookup: {
        from: "locations",
        localField: "location",
        foreignField: "_id",
        as: "location",
      },
    },
    { $unwind: { path: "$location", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        name: 1,
        lastActivity: 1,
        uniqueId: 1,
        isActive: 1,
        location: {
          shopOrBuildingNumber: "$location.shopOrBuildingNumber",
          address: "$location.address",
          area: "$location.area",
          state: "$location.state",
          city: "$location.city",
          country: "$location.country",
          zipCode: "$location.zipCode",
        },
      },
    },
    {
      $facet: {
        data: [{ $skip: skip }, { $limit: limit }],
        totalCount: [{ $count: "count" }],
      },
    },
    {
      $project: {
        data: 1,
        total: { $ifNull: [{ $arrayElemAt: ["$totalCount.count", 0] }, 0] },
      },
    },
  ];
  const result = await User.aggregate(pipeline);
  return {
    total: result[0]?.total || 0,
    page,
    limit,
    data: result[0]?.data || [],
  };
};
