const Voucher = require("../../model/Voucher");

exports.getVouchers = async (query) => {
  const {
    brandId,
    subBrandId,
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
  const filter = { isDeleted: true };
  if (brandId) filter.brand = brandId;
  if (subBrandId) filter.subBrands = subBrandId;
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
      .populate("brand", "name")
      .populate("subBrands", "name")
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
