const SuggestionAd = require("../../model/SuggestionAds");
const Voucher = require("../../model/Voucher");
const Image = require("../../model/Image");
const { throwError } = require("../../utils");
const { OFFERS_SCOPE } = require("../../constants");
const { uploadImage } = require("../uploadServices");

exports.createSuggestionAd = async (userId, voucherId, images, payload) => {
  let { scope, users, states, cities, title, description, discountTitle } =
    payload;

  const linkedVoucher = await Voucher.findById(voucherId);
  if (!linkedVoucher) throwError(404, "Voucher not found");
  if (!linkedVoucher.isActive || linkedVoucher.isDeleted)
    throwError(400, "Linked voucher is not active");

  if (!states || !cities) {
    throwError(400, "States or cities are required");
  }
  states = JSON.parse(states);
  cities = JSON.parse(cities);

  users = users ? JSON.parse(users) : [];
  const finalUsers = scope === OFFERS_SCOPE.ALL_USERS ? [] : users;
  const publishedDate =
    linkedVoucher?.validFrom > new Date()
      ? new Date()
      : linkedVoucher?.validFrom;
  const endDate = linkedVoucher.validTill;
  const originalPrice = linkedVoucher.minOrderAmount || 0;
  let discountPrice = originalPrice;
  if (linkedVoucher.discount && originalPrice > 0) {
    discountPrice =
      originalPrice - (originalPrice * linkedVoucher.discount) / 100;
  }
  images = images ? (Array.isArray(images) ? images : [images]) : [];
  let imageIds = [];
  if (images && images.length > 0) {
    if (images.length > 5) {
      throwError(400, "You can upload a maximum of 5 images.");
    }
    for (const image of images) {
      const imageUrl = await uploadImage(image.tempFilePath);
      const imageDoc = await Image.create({
        user: userId,
        suggestionAd: null,
        imageUrl,
        filename: image.name,
        size: image.size,
        mime: image.mimetype,
        type: "android",
      });
      imageIds.push(imageDoc._id);
    }
  }
  const suggestionData = {
    voucher: voucherId,
    users: finalUsers,
    states: states,
    cities: cities,
    scope,
    title,
    description,
    discountTitle: discountTitle || `Upto ${linkedVoucher.discount}% OFF`,
    originalPrice,
    discountPrice,
    publishedDate,
    endDate,
    valueOfAmount: linkedVoucher.discount,
    images: imageIds,
  };
  const suggestion = await SuggestionAd.create(suggestionData);
  if (imageIds.length > 0) {
    await Image.updateMany(
      { _id: { $in: imageIds } },
      { suggestionAd: suggestion._id }
    );
  }
  return suggestion;
};
