const Bill = require("../../model/Bill");
const Voucher = require("../../model/Voucher");
const PromoCode = require("../../model/PromoCode");
const LessAmount = require("../../model/LessAmount");

function calculateConvenienceFee(amount) {
  return Math.ceil(amount / 500) * 5;
}

exports.createBillAmount = async (userId, payload) => {
  const { billAmount, voucherId, offer } = payload;
  const voucher = await Voucher.findById(voucherId);
  if (!voucher || voucher.isDeleted) {
    throw new Error("Invalid or inactive voucher");
  }
  if (billAmount < (voucher.minOrderAmount || 0)) {
    throw new Error(
      `Bill amount must be at least ${voucher.minOrderAmount} for this voucher`
    );
  }
  const voucherDiscountValue = (billAmount * voucher?.discount) / 100;
  let appliedOffers = [];
  let offerDiscount = 0;
  if (offer?.offerType && offer?.offerId) {
    let offerDoc = null;
    if (offer.offerType === "PromoCode") {
      offerDoc = await PromoCode.findById(offer.offerId);
    } else if (offer.offerType === "LessAmount") {
      offerDoc = await LessAmount.findById(offer.offerId);
    }
    if (!offerDoc) {
      throw new Error("Invalid offer selected");
    }
    offerDiscount = offerDoc.maxDiscountValue || 0;
    appliedOffers.push({
      offerType: offer.offerType,
      offerId: offer.offerId,
      discountValue: offerDiscount,
    });
    await offerDoc.updateOne({
      $addToSet: { claimedUsers: { userId, claimedAt: new Date() } },
    });
  }
  await voucher.updateOne({
    $addToSet: { claimedUsers: { userId, claimedAt: new Date() } },
  });
  const convenienceFee = calculateConvenienceFee(billAmount);
  const totalDiscountValue = voucherDiscountValue + offerDiscount;
  const finalPayable = Math.max(
    0,
    billAmount - totalDiscountValue + convenienceFee
  );
  const bill = await Bill.create({
    userId,
    voucherId,
    voucherDiscountValue,
    billAmount,
    appliedOffers,
    convenienceFee,
    totalDiscountValue,
    finalPayable,
  });
  return bill;
};
