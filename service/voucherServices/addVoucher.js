const SubBrand = require("../../model/SubBrand");
const { VOUCHER_STATUS } = require("../../constants");
const { createVoucher } = require("./createVoucher");
const {
  validateVoucherDatesAndStatus,
  determineIsActive,
  generateUniqueVoucherId,
} = require("../../helpers/vouchers");

exports.addVoucher = async (voucherData, userId, brandId, brandUserId) => {
  let { publishedDate, validFrom, validTill, status, subBrandIds, ...rest } =
    voucherData;

  const subBrandsArray = Array.isArray(subBrandIds)
    ? subBrandIds
    : [subBrandIds];

  const finalPublishedDate = publishedDate
    ? new Date(publishedDate)
    : new Date(validFrom);

  const dateError = validateVoucherDatesAndStatus(
    status,
    finalPublishedDate,
    validFrom,
    validTill
  );
  if (dateError) {
    throw { statusCode: 400, message: dateError };
  }
  const isActive = determineIsActive(status);
  const isPublished =
    status === VOUCHER_STATUS.ACTIVE ||
    status === VOUCHER_STATUS.EXPIRED ||
    status === VOUCHER_STATUS.USED_UP;

  const voucher = await createVoucher({
    ...rest,
    user: brandUserId,
    brand: brandId,
    createdBy: userId,
    subBrands: subBrandsArray,
    status,
    publishedDate,
    validFrom,
    validTill,
    isActive,
    isPublished,
    uniqueId: await generateUniqueVoucherId(),
  });
  if (voucher && subBrandsArray.length > 0) {
    await SubBrand.updateMany(
      { _id: { $in: subBrandsArray } },
      { $addToSet: { vouchers: voucher._id } }
    );
  }
  return voucher;
};
