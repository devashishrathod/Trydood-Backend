const mongoose = require("mongoose");
const { DefaultImages } = require("../constants");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    mobile: {
      type: Number,
    },
    password: {
      type: String,
    },
    address: {
      type: String,
    },
    dob: {
      type: String,
    },
    role: {
      type: String,
      enum: ["admin", "user", "vendor", "marketer"], //vendor means brand
      default: "user",
    },
    isMobileVerify: {
      type: Boolean,
      default: false,
    },
    lastActivity: {
      type: Date,
      default: Date.now,
    },
    lastLocation: {
      lat: Number,
      lng: Number,
    },
    currentLocation: {
      lat: Number,
      lng: Number,
    },
    fcmToken: {
      type: String,
    },
    referCode: {
      type: String,
      unique: true,
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
    },
    applyReferalCode: {
      type: String,
    },
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    follwer: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    blockUser: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    instagram: {
      isLinked: {
        type: Boolean,
        default: false,
      },
      authToken: {
        type: String,
      },
    },
    facebook: {
      isLinked: {
        type: Boolean,
        default: false,
      },
      authToken: {
        type: String,
      },
    },
    twitter: {
      isLinked: {
        type: Boolean,
        default: false,
      },
      authToken: {
        type: String,
      },
    },
    linkedIn: {
      isLinked: {
        type: Boolean,
        default: false,
      },
      authToken: {
        type: String,
      },
    },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
    },
    bankAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BankAccount",
    },
    gst: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gst",
    },
    workHour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WorkHours",
    },
    referUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    subscribed: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscribed",
    },
    isSubscribed: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
      default: DefaultImages.profileUrl,
    },
    uniqueId: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true, versionKey: false }
);
module.exports = mongoose.model("User", UserSchema);
