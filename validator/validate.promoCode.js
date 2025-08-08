const Joi = require("joi");
const mongoose = require("mongoose");

const objectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.message(`"${value}" is not a valid ObjectId`);
  }
  return value;
};

exports.validateCreatePromoCode = (promoCodeData) => {
  const createPromoCodeSchema = Joi.object({
    claimedUsers: Joi.array()
      .items(
        Joi.object({
          userId: Joi.string().custom(objectId).required(),
          claimedAt: Joi.date().optional(),
        })
      )
      .optional(),
    voucher: Joi.string().custom(objectId).required(),
    title: Joi.string().optional().allow(""),
    description: Joi.string().optional().allow(""),
    promoCode: Joi.string().min(3).trim().required(),
    maxDiscount: Joi.number().positive().required(),
    userLimit: Joi.number().positive().required(),
    validFrom: Joi.date().optional(),
    validTill: Joi.date().optional(),
  }).options({ abortEarly: false });

  return createPromoCodeSchema.validate(promoCodeData);
};
