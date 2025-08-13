const mongoose = require("mongoose");
const { userField, voucherField } = require("./validMogooseObjectId");

const BillSchema = new mongoose.Schema(
  {
    userId: userField,
    voucherId: voucherField,
    voucherDiscountValue: { type: Number, required: true },
    billAmount: { type: Number, required: true },
    appliedOffers: [
      {
        offerType: {
          type: String,
          enum: ["PromoCode", "LessAmount"],
          default: null,
        },
        offerId: { type: mongoose.Schema.Types.ObjectId, default: null },
        discountValue: { type: Number, default: 0 },
      },
      { _id: false },
    ],
    convenienceFee: { type: Number, default: 0 },
    totalDiscountValue: { type: Number, default: 0 },
    finalPayable: { type: Number, required: true },
  },
  { timestamps: true, versionKey: false }
);

function calculateConvenienceFee(amount) {
  return Math.ceil(amount / 500) * 5;
}

BillSchema.pre("save", function (next) {
  if (!this.voucherId || this.voucherDiscountValue == null) {
    return next(new Error("Voucher is mandatory for every bill."));
  }
  const seenTypes = new Set();
  for (let offer of this.appliedOffers) {
    if (seenTypes.has(offer.offerType)) {
      return next(
        new Error(`Only one offer of type '${offer.offerType}' can be applied.`)
      );
    }
    seenTypes.add(offer.offerType);
  }
  this.convenienceFee = calculateConvenienceFee(this.billAmount);
  this.totalDiscountValue =
    (this.voucherDiscountValue || 0) +
    this.appliedOffers.reduce((sum, o) => sum + (o.discountValue || 0), 0);
  this.finalPayable = Math.max(
    0,
    this.billAmount - this.totalDiscountValue + this.convenienceFee
  );
  next();
});

module.exports = mongoose.model("Bill", BillSchema);
