const mongoose = require("mongoose");
const {
  subscriptionField,
  brandField,
  userField,
  transactionField,
} = require("./validMogooseObjectId");

const subscribedSchema = new mongoose.Schema(
  {
    user: userField,
    brand: brandField,
    subscribedBy: userField,
    upgradedBy: userField,
    transaction: transactionField,
    subscription: subscriptionField,
    previousPlans: {
      type: [
        new mongoose.Schema({
          subscription: subscriptionField,
          subscribedBy: userField,
          transaction: transactionField,
          startDate: { type: Date },
          endDate: { type: Date },
          upgradeDate: { type: Date },
          paidAmount: { type: Number },
          price: { type: Number },
          discount: { type: Number },
          numberOfSubBrands: { type: Number },
          dueAmount: { type: Number },
        }),
      ],
      default: [],
    },
    durationInDays: { type: Number },
    durationInYears: { type: Number },
    startDate: { type: Date },
    endDate: { type: Date },
    price: { type: Number },
    discount: { type: Number },
    numberOfSubBrands: { type: Number },
    paidAmount: { type: Number },
    dueAmount: { type: Number },
    upgradeDate: { type: Date },
    numberOfUpgrade: { type: Number, default: 0 },
    isCoolingPlan: { type: Boolean, default: false },
    isExpired: { type: Boolean, default: false },
    isUpgraded: { type: Boolean, default: false },
    isActive: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);

subscribedSchema.index({ endDate: 1, isExpired: 1 });

module.exports = mongoose.model("Subscribed", subscribedSchema);
