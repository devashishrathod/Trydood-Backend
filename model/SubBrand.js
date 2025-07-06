const mongoose = require("mongoose");
const validator = require("validator");
const { isValidPhoneNumber, isValidPAN } = require("../validator/common");
const { generateUniqueSubBrandId } = require("../service/subBrandServices");
const {
  userField,
  brandField,
  categoryField,
  subCategoryField,
  locationField,
  workHoursField,
  gstField,
  bankAccountField,
} = require("./validMogooseObjectId");

const subBrandSchema = new mongoose.Schema(
  {
    name: { type: String },
    logo: { type: String },
    cover: { type: String },
    description: { type: String },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      validate: {
        validator: validator.isEmail,
        message: (props) => `${props.value} is not a valid email address`,
      },
    },
    mobile: {
      type: Number,
      validate: {
        validator: isValidPhoneNumber,
        message: (props) => `${props.value} is not a valid mobile number`,
      },
    },
    whatsappNumber: {
      type: Number,
      validate: {
        validator: isValidPhoneNumber,
        message: (props) => `${props.value} is not a valid WhatsApp number`,
      },
    },
    panNumber: {
      type: String,
      sparse: true,
      validate: {
        validator: isValidPAN,
        message: (props) => `${props.value} is not a valid PAN number`,
      },
    },
    user: userField,
    brand: brandField,
    category: categoryField,
    subCategory: subCategoryField,
    location: locationField,
    workHours: workHoursField,
    gst: gstField,
    bankAccount: bankAccountField,
    joinedDate: { type: Date, default: Date.now },
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
