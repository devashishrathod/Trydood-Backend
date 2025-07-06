const mongoose = require("mongoose");
const { userField, brandField } = require("./validMogooseObjectId");

const workHoursSchema = new mongoose.Schema(
  {
    user: userField,
    brand: brandField,
    monday: { start: { type: String }, end: { type: String } },
    tuesday: { start: { type: String }, end: { type: String } },
    wednesday: { start: { type: String }, end: { type: String } },
    thursday: { start: { type: String }, end: { type: String } },
    friday: { start: { type: String }, end: { type: String } },
    saturday: { start: { type: String }, end: { type: String } },
    sunday: { start: { type: String }, end: { type: String } },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("WorkHours", workHoursSchema);
