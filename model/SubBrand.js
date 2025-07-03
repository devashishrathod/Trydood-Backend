const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const { generateUniqueSubBrandId } = require("../service/subBrandServices");

const subBrandSchema = new mongoose.Schema(
  {
    user: { type: ObjectId, ref: "User" },
    brand: { type: ObjectId, ref: "Brand" },
    name: { type: String },
    logo: { type: String },
    cover: { type: String },
    email: { type: String },
    mobile: { type: Number, unique: true },
    whatsappNumber: { type: Number },
    category: { type: ObjectId, ref: "Category" },
    subCategory: { type: ObjectId, ref: "SubCategory" },
    description: { type: String },
    joinedDate: { type: Date, default: Date.now },
    location: { type: ObjectId, ref: "Location" },
    workHours: { type: ObjectId, ref: "WorkHours" },
    gst: { type: ObjectId, ref: "Gst" },
    isMarketPermission: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    uniqueId: { type: String, unique: true },
  },
  { timestamps: true, versionKey: false }
);

subBrandSchema.pre("save", function (next) {
  if (this.isNew && !this.uniqueId) {
    this.uniqueId = generateUniqueSubBrandId();
  }
  next();
});

module.exports = mongoose.model("SubBrand", subBrandSchema);
