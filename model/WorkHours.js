const mongoose = require("mongoose");
const { userField, brandField } = require("./validMogooseObjectId");

const workHoursSchema = new mongoose.Schema(
  {
    user: userField,
    brand: brandField,
    monday: {
      start: { type: String },
      end: { type: String },
      isOpen: { type: Boolean, default: false },
    },
    tuesday: {
      start: { type: String },
      end: { type: String },
      isOpen: { type: Boolean, default: false },
    },
    wednesday: {
      start: { type: String },
      end: { type: String },
      isOpen: { type: Boolean, default: false },
    },
    thursday: {
      start: { type: String },
      end: { type: String },
      isOpen: { type: Boolean, default: false },
    },
    friday: {
      start: { type: String },
      end: { type: String },
      isOpen: { type: Boolean, default: false },
    },
    saturday: {
      start: { type: String },
      end: { type: String },
      isOpen: { type: Boolean, default: false },
    },
    sunday: {
      start: { type: String },
      end: { type: String },
      isOpen: { type: Boolean, default: false },
    },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("WorkHours", workHoursSchema);
