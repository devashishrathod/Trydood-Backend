const mongoose = require("mongoose");
const { PLATFORMS } = require("../constants");
const {
  userField,
  brandField,
  subBrandField,
  categoryField,
  subCategoryField,
} = require("./validMogooseObjectId");

const imageSchema = new mongoose.Schema(
  {
    user: userField,
    brand: brandField,
    subBrand: subBrandField,
    category: categoryField,
    subCategory: subCategoryField,
    image: { type: String },
    type: { type: String, enum: [...Object.values(PLATFORMS)] },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Image", imageSchema);
