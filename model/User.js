const mongoose = require("mongoose");
const validator = require("validator");
const { DefaultImages, ROLES } = require("../constants");
const { isValidPhoneNumber, isValidPAN } = require("../validator/common");
const {
  userField,
  usersField,
  locationField,
  workHoursField,
  gstField,
  bankAccountField,
  subscribedField,
  brandField,
  subBrandField,
  subBrandsField,
} = require("./validMogooseObjectId");

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    address: { type: String },
    dob: { type: String },
    role: {
      type: String,
      enum: [...Object.values(ROLES)],
      default: ROLES.USER,
    },
    brand: brandField,
    subBrand: subBrandField,
    subBrands: subBrandsField,
    followings: usersField,
    followers: usersField,
    blockUsers: usersField,
    likes: usersField,
    subscribed: subscribedField,
    location: locationField,
    bankAccount: bankAccountField,
    gst: gstField,
    workHour: workHoursField,
    referUser: userField,
    password: { type: String },
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
        validator: function (value) {
          if (value === null || value === undefined || value === "")
            return true;
          return isValidPAN(value);
        },
        message: (props) => `${props.value} is not a valid PAN number`,
      },
    },
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
    referCode: { type: String, unique: true },
    appliedReferalCode: { type: String },
    lastActivity: { type: Date, default: Date.now },
    lastLocation: { lat: Number, lng: Number },
    currentLocation: { lat: Number, lng: Number },
    fcmToken: { type: String },
    image: { type: String, default: DefaultImages.profileUrl },
    uniqueId: { type: String, unique: true },
    currentScreen: { type: String, default: "LANDING_SCREEN" },
    isEmailVerified: { type: Boolean, default: false },
    isMobileVerified: { type: Boolean, default: false },
    isSubscribed: { type: Boolean, default: false },
    isSignUpCompleted: { type: Boolean, default: false },
    isOnBoardingCompleted: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("User", userSchema);
