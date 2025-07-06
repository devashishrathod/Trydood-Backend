const mongoose = require("mongoose");
const {
  subscriptionField,
  brandField,
  userField,
} = require("./validMogooseObjectId");

const subscribedSchema = new mongoose.Schema(
  {
    user: userField,
    brand: brandField,
    subscription: subscriptionField,
    duration: { type: Number },
    startDate: { type: Date },
    endDate: { type: Date },
    price: { type: Number },
    discount: { type: Number },
    numberOfSubBrands: { type: Number },
    paidAmount: { type: Number },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);
module.exports = mongoose.model("Subscribed", subscribedSchema);
