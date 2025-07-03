const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const GstSchema = new mongoose.Schema(
  {
    companyName: { type: String },
    gstNumber: {
      type: String,
      sparse: true,
      match: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
    },
    panNumber: {
      type: String,
      sparse: true,
      match: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
    },
    zipCode: { type: String },
    user: { type: ObjectId, ref: "User" },
    brand: { type: ObjectId, ref: "Brand" },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Gst", GstSchema);
