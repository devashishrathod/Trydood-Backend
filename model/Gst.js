const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const GstSchema = new mongoose.Schema(
  {
    companyName: { type: String },
    gstNumber: { type: String },
    zipCode: { type: String },
    user: { type: ObjectId, ref: "User" },
    brand: { type: ObjectId, ref: "Brand" },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Gst", GstSchema);
