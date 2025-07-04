const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const { DefaultImages, ROLES } = require("../constants");

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String },
    isEmailVerified: { type: Boolean, default: false },
    mobile: { type: Number },
    isMobileVerified: { type: Boolean, default: false },
    // password: { type: String },
    address: { type: String },
    dob: { type: String },
    role: {
      type: String,
      enum: [...Object.values(ROLES)],
      default: ROLES.USER,
    },
    lastActivity: { type: Date, default: Date.now },
    lastLocation: { lat: Number, lng: Number },
    currentLocation: { lat: Number, lng: Number },
    fcmToken: { type: String },
    referCode: { type: String, unique: true },
    brand: { type: ObjectId, ref: "Brand" },
    appliedReferalCode: { type: String },
    followings: [{ type: ObjectId, ref: "User" }],
    followers: [{ type: ObjectId, ref: "User" }],
    blockUsers: [{ type: ObjectId, ref: "User" }],
    likes: [{ type: ObjectId, ref: "User" }],
    instagram: {
      isLinked: { type: Boolean, default: false },
      authToken: { type: String },
    },
    facebook: {
      isLinked: { type: Boolean, default: false },
      authToken: { type: String },
    },
    twitter: {
      isLinked: { type: Boolean, default: false },
      authToken: { type: String },
    },
    linkedIn: {
      isLinked: { type: Boolean, default: false },
      authToken: { type: String },
    },
    location: { type: ObjectId, ref: "Location" },
    bankAccount: { type: ObjectId, ref: "BankAccount" },
    gst: { type: ObjectId, ref: "Gst" },
    workHour: { type: ObjectId, ref: "WorkHours" },
    referUser: { type: ObjectId, ref: "User" },
    isActive: { type: Boolean, default: true },
    panNumber: {
      type: String,
      sparse: true,
      match: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
    },
    subscribed: { type: ObjectId, ref: "Subscribed" },
    isSubscribed: { type: Boolean, default: false },
    currentScreen: { type: String, default: "LANDING_SCREEN" },
    isSignUpCompleted: { type: Boolean, default: false },
    isOnBoardingCompleted: { type: Boolean, default: false },
    image: { type: String, default: DefaultImages.profileUrl },
    uniqueId: { type: String, unique: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("User", userSchema);
