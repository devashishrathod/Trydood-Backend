const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const brandSchema = new mongoose.Schema(
  {
    user: { type: ObjectId, ref: "User" },
    name: { type: String },
    logo: { type: String },
    cover: { type: String },
    slogan: { type: String },
    email: { type: String },
    mobile: { type: Number },
    whatsappNumber: { type: Number },
    companyName: { type: String },
    panNumber: {
      type: String,
      sparse: true,
      match: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
    },
    category: { type: ObjectId, ref: "Category" },
    subCategory: { type: ObjectId, ref: "SubCategory" },
    description: { type: String },
    location: { type: ObjectId, ref: "Location" },
    workHours: { type: ObjectId, ref: "WorkHours" },
    gst: { type: ObjectId, ref: "Gst" },
    isMarketPermission: { type: Boolean, default: true },
    joinedDate: { type: Date, default: Date.now },
    subBrands: [{ type: ObjectId, ref: "SubBrand" }],
    isActive: { type: Boolean, default: true },
    referMarketId: { type: String },
    referMarketMobile: { type: String },
    subscribed: { type: ObjectId, ref: "Subscribed" },
    isSubscribed: { type: Boolean, default: false },
    isSignUpCompleted: { type: Boolean, default: false },
    currentScreen: { type: String },
    isDeleted: { type: Boolean, default: false },
    uniqueId: { type: String, unique: true },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Brand", brandSchema);
