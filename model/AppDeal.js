const mongoose = require("mongoose");

const AppDealSchema = new mongoose.Schema(
  {
    image: { type: String },
    name: { type: String },
    title: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AppDeal", AppDealSchema);
