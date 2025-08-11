const mongoose = require("mongoose");
const {
  userField,
  usersField,
  voucherField,
} = require("./validMogooseObjectId");

const claimedUserSchema = new mongoose.Schema(
  { userId: userField, claimedAt: { type: Date, default: Date.now } },
  { _id: false }
);

const lessAmountSchema = new mongoose.Schema(
  {
    users: usersField,
    voucher: voucherField,
    claimedUsers: { type: [claimedUserSchema], default: [] },
    title: { type: String },
    description: { type: String, trim: true },
    maxDiscount: { type: Number, required: true },
    validFrom: { type: Date, required: true },
    validTill: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("LessAmount", lessAmountSchema);
