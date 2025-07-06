const mongoose = require("mongoose");
const {
  userField,
  brandField,
  subBrandField,
} = require("./validMogooseObjectId");

const locationSchema = new mongoose.Schema(
  {
    user: userField,
    brand: brandField,
    subBrand: subBrandField,
    name: { type: String },
    shopOrBuildingNumber: { type: String },
    address: { type: String },
    area: { type: String },
    landMark: { type: String },
    state: { type: String },
    city: { type: String },
    pinCode: { type: String },
    country: { type: String },
    street: { type: String },
    formattedAddress: { type: String },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
      },
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);

locationSchema.index(
  { location: "2dsphere" },
  {
    partialFilterExpression: {
      "location.coordinates": { $exists: true, $type: "array" },
    },
  }
);

module.exports = mongoose.model("Location", locationSchema);
