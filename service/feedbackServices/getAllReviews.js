const Feedback = require("../../model/Feedback");

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
  } = query;
  const filter = { isDeleted: false };
  if (rating) filter.rating = parseInt(rating);
  if (brand) filter.brand = brand;
  if (subBrand) filter.subBrand = subBrand;
  if (user) filter.user = user;
  if (isBlocked !== undefined) filter.isBlocked = isBlocked === "true";
  if (isActive !== undefined) filter.isActive = isActive === "true";
  if (search) {
    filter.review = { $regex: search, $options: "i" };
  }
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [data, total] = await Promise.all([
    Feedback.find(filter)
      .populate("user", "name image")
      .populate("brand", "companyName")
      .populate("subBrand", "companyName")
      .populate("imageIds", "imageUrl")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    Feedback.countDocuments(filter),
  ]);
  return {
    total,
    totalPages: Math.ceil(total / limit),
    page: parseInt(page),
    limit: parseInt(limit),
    data,
  };
};
