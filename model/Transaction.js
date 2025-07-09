const mongoose = require("mongoose");
const { userField } = require("./validMogooseObjectId");
const {
  PAYMENT_STATUS,
  PAYMENT_METHODS,
  WALLET_PROVIDERS,
} = require("../constants");

const transactionSchema = new mongoose.Schema(
  {
    user: userField,
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    status: {
      type: String,
      enum: [...Object.values(PAYMENT_STATUS)],
      default: PAYMENT_STATUS.CREATED,
    },
    paymentMethod: {
      type: String,
      enum: Object.values(PAYMENT_METHODS),
      required: true,
    },
    walletProvider: { type: String, enum: WALLET_PROVIDERS },
    razorpayOrderId: { type: String, required: true, unique: true },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    invoiceId: { type: String },
    invoiceUrl: { type: String },
    receipt: { type: String, maxlength: 40 },
    notes: { type: mongoose.Schema.Types.Mixed },
    verified: { type: Boolean, default: false },
    error: { type: String },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Transaction", transactionSchema);
