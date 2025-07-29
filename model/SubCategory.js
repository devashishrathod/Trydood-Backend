const mongoose = require("mongoose");
const { PLATFORMS } = require("../constants");
const { categoryField } = require("./validMogooseObjectId");

const subCategorySchema = new mongoose.Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    name: { type: String },
    image: { type: String },
    category: categoryField,
    type: { type: String, enum: [...Object.values(PLATFORMS)] },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);
module.exports = mongoose.model("SubCategory", subCategorySchema);
