const PromoCode = require("../../model/PromoCode");
const Voucher = require("../../model/Voucher");

exports.createCode = async (payload) => {
  const { voucher, validFrom, validTill } = payload;
  const linkedVoucher = await Voucher.findOne({
    _id: voucher,
    isDeleted: false,
  });
  if (!linkedVoucher) {
    throw new Error("No valid voucher found for provided ID");
  }
  const minVoucherStart = linkedVoucher.validFrom;
  const maxVoucherEnd = linkedVoucher.validTill;
  let finalStart = validFrom ? new Date(validFrom) : minVoucherStart;
  if (finalStart < minVoucherStart) {
    throw new Error(
      `validFrom cannot be earlier than voucher start date: ${minVoucherStart.toISOString()}`
    );
  }
  let finalEnd = validTill ? new Date(validTill) : maxVoucherEnd;
  if (finalEnd > maxVoucherEnd) {
    throw new Error(
      `validTill cannot be later than voucher end date: ${maxVoucherEnd.toISOString()}`
    );
  }
  if (finalStart >= finalEnd) {
    throw new Error("validFrom must be earlier than validTill");
  }
  const now = new Date();
  const isActive = now >= finalStart && now <= finalEnd;
  const newPromoCode = await PromoCode.create({
    ...payload,
    claimedUsers: payload.claimedUsers || [],
    validFrom: finalStart,
    validTill: finalEnd,
    isActive,
  });
  return newPromoCode;
};
