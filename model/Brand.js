const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const { generateUniqueBrandId } = require("../service/brandServices");

const BrandSchema = new mongoose.Schema(
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
    pan: { type: String },
    category: { type: ObjectId, ref: "Category" },
    subCategory: { type: ObjectId, ref: "SubCategory" },
    description: { type: String },
    location: { type: ObjectId, ref: "Location" },
    workHours: { type: ObjectId, ref: "WorkHours" },
    gst: { type: ObjectId, ref: "Gst" },
    isMarketPermission: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
    referApply: { type: String },
    subscribed: { type: ObjectId, ref: "Subscribed" },
    isSubscribed: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    uniqueId: { type: String, unique: true },
  },
  { timestamps: true, versionKey: false }
);

BrandSchema.pre("save", function (next) {
  if (this.isNew) {
    this.uniqueId = generateUniqueBrandId();
  }
  next();
});

module.exports = mongoose.model("Brand", BrandSchema);
