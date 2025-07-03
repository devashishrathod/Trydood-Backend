const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const LocationSchema = new mongoose.Schema(
  {
    user: { type: ObjectId, ref: "User" },
    brand: { type: ObjectId, ref: "Brand" },
    subBrand: { type: ObjectId, ref: "subBrand" },
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
  },
  { timestamps: true, versionKey: false }
);

LocationSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Location", LocationSchema);
