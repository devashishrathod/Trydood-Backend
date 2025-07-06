const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    name: { type: String },
    price: { type: Number },
    duration: { type: Number },
    numberOfSubBrands: { type: Number },
    discount: { type: Number },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Subscription", subscriptionSchema);
