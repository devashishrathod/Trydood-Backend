const Feedback = require("../../model/Feedback");
const User = require("../../model/User");

exports.getAllReviews = async (query) => {
  const {
    page = 1,
    limit = 10,
    rating,
    brand,
    subBrand,
    user,
    isBlocked,
    isActive,
    search = "",
    startDate,
    endDate,
  } = query;
  const filter = {
    isDeleted: false,
    isBlocked: isBlocked !== undefined ? isBlocked === "true" : false,
    isActive: isActive !== undefined ? isActive === "true" : true,
  };
  if (rating) filter.rating = parseInt(rating);
  if (brand) filter.brand = brand;
  if (subBrand) filter.subBrand = subBrand;
  if (user) filter.user = user;
  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate) filter.createdAt.$lte = new Date(endDate);
  }
  if (search) {
    const searchRegex = new RegExp(search, "i");
    const matchedUser = await User.findOne({ uniqueId: search });
    if (matchedUser) {
      filter.user = matchedUser._id;
    } else {
      filter.$or = [{ review: { $regex: searchRegex } }];
    }
  }
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const aggregatePipeline = [
    { $match: filter },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
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
        as: "brandLocation",
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
    { $unwind: { path: "$subBrand", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "locations",
        localField: "subBrand.location",
        foreignField: "_id",
        as: "subBrandLocation",
      },
    },
    {
      $lookup: {
        from: "images",
        localField: "imageIds",
        foreignField: "_id",
        as: "images",
      },
    },
    {
      $facet: {
        data: [
          { $sort: { createdAt: -1 } },
          { $skip: skip },
          { $limit: parseInt(limit) },
          {
            $project: {
              review: 1,
              rating: 1,
              createdAt: 1,
              isBlocked: 1,
              isActive: 1,
              user: { name: 1, image: 1, uniqueId: 1 },
              brand: { companyName: 1 },
              brandLocation: {
                shopOrBuildingNumber: 1,
                address: 1,
                city: 1,
                area: 1,
                country: 1,
              },
              subBrand: { companyName: 1 },
              subBrandLocation: {
                shopOrBuildingNumber: 1,
                address: 1,
                city: 1,
                area: 1,
                country: 1,
              },
              images: { imageUrl: 1 },
            },
          },
        ],
        totalCount: [{ $count: "count" }],
      },
    },
  ];
  const result = await Feedback.aggregate(aggregatePipeline);
  const data = result[0].data;
  const total = result[0].totalCount[0]?.count || 0;
  return {
    total,
    totalPages: Math.ceil(total / limit),
    page: parseInt(page),
    limit: parseInt(limit),
    data,
  };
};
