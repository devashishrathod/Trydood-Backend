const mongoose = require("mongoose");
const { OFFERS_SCOPE } = require("../constants");
const {
  imagesField,
  usersField,
  voucherField,
} = require("./validMogooseObjectId");

const suggestionSchema = new mongoose.Schema(
  {
    users: usersField,
    voucher: voucherField,
    images: imagesField,
    scope: {
      type: String,
      enum: [...Object.values(OFFERS_SCOPE)],
      default: OFFERS_SCOPE.ALL_USERS,
    },
    title: {
      type: String,
      required: [true, "Suggestion title is required"],
      minlength: 3,
      maxlength: 100,
      trim: true,
    },
    description: {
      type: String,
      maxlength: 500,
      default: "",
      trim: true,
    },
    locations: [
      {
        stateId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "State",
          required: true,
        },
        stateName: { type: String, required: true },
        districts: [
          {
            districtId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "District",
              required: true,
            },
            districtName: { type: String, required: true },
            cities: [
              {
                cityId: {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: "City",
                  required: true,
                },
                cityName: { type: String, required: true },
              },
            ],
          },
        ],
      },
    ],
    discount: { type: Number },
    originalPrice: {
      type: Number,
      required: true,
      min: [0, "Price cannot be negative"],
    },
    discountPrice: {
      type: Number,
      required: true,
      min: [0, "Discount price cannot be negative"],
      validate: {
        validator: function (v) {
          return v < this.originalPrice;
        },
        message: "Discount price must be less than original price",
      },
    },
    publishedDate: { type: Date, required: true },
    endDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (v) {
          return v >= this.publishedDate;
        },
        message: "End date must be after or equal to published date",
      },
    },
    valueOfAmount: { type: Number, min: 0 },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Suggestion", suggestionSchema);
