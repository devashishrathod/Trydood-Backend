const mongoose = require("mongoose");
const Voucher = require("../../model/Voucher");

exports.getVouchers = async (query) => {
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
  } = query;
  const filter = { isDeleted: false };
  if (brandId && mongoose.isValidObjectId(brandId)) {
    filter.brand = new mongoose.Types.ObjectId(brandId.toString());
  }
  if (subBrandId && mongoose.isValidObjectId(subBrandId)) {
    filter.subBrands = new mongoose.Types.ObjectId(subBrandId.toString());
  }
  if (categoryId && mongoose.isValidObjectId(categoryId)) {
    filter.category = new mongoose.Types.ObjectId(categoryId.toString());
  }
  if (subCategoryId && mongoose.isValidObjectId(subCategoryId)) {
    filter.subCategory = new mongoose.Types.ObjectId(subCategoryId.toString());
  }
  if (status) filter.status = status;
  if (isPublished !== undefined) filter.isPublished = isPublished === "true";
  if (isActive !== undefined) filter.isActive = isActive === "true";
  if (validFrom || validTill) {
    filter.validFrom = {};
    if (validFrom) filter.validFrom.$gte = new Date(validFrom);
    if (validTill) filter.validFrom.$lte = new Date(validTill);
  }
  const sortOption = {
    [sortBy]: sortOrder === "asc" ? 1 : -1,
  };
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [vouchers, total] = await Promise.all([
    Voucher.find(filter)
      .populate({
        path: "brand",
        populate: { path: "location" },
      })
      .populate("subBrands")
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit)),
    Voucher.countDocuments(filter),
  ]);
  return {
    total,
    page: parseInt(page),
    limit: parseInt(limit),
    vouchers,
  };
};
