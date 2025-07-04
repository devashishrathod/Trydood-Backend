const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const subCategorySchema = new mongoose.Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    name: { type: String },
    image: { type: String },
    category: { type: ObjectId, ref: "Category" },
    type: { type: String, enum: ["web", "android", "ios"] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false }
);
module.exports = mongoose.model("SubCategory", subCategorySchema);
