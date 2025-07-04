const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const workHoursSchema = new mongoose.Schema(
  {
    brand: { type: ObjectId, ref: "Brand" },
    user: { type: ObjectId, ref: "User" },
    monday: { start: { type: String }, end: { type: String } },
    tuesday: { start: { type: String }, end: { type: String } },
    wednesday: { start: { type: String }, end: { type: String } },
    thursday: { start: { type: String }, end: { type: String } },
    friday: { start: { type: String }, end: { type: String } },
    saturday: { start: { type: String }, end: { type: String } },
    sunday: { start: { type: String }, end: { type: String } },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("WorkHours", workHoursSchema);
