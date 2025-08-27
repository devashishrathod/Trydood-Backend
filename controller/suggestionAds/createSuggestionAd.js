const { asyncWrapper, sendSuccess } = require("../../utils");
const { createSuggestionAd } = require("../../service/suggestionAdsServices");

exports.createSuggestionAd = asyncWrapper(async (req, res, next) => {
  const userId = req.payload?._id;
  const { voucherId } = req.params;
  const images = req.files?.images;
  const data = await createSuggestionAd(userId, voucherId, images, req.body);
  return sendSuccess(res, 201, "Suggestion Ad created successfully", data);
});
