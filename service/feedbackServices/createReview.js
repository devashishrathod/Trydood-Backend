const CustomError = require("../../utils/CustomError");
const Feedback = require("../../model/Feedback");
const Image = require("../../model/Image");
const { uploadImage } = require("../uploadServices");

exports.createReview = async (userId, brandId, rating, review, images) => {
  if (!rating || rating < 1 || rating > 5) {
    throw new CustomError(400, "Rating must be between 1 and 5.");
  }
  let imageIds = [];
  if (images && images.length > 0) {
    if (images.length > 5) {
      throw new CustomError(400, "You can upload a maximum of 5 images.");
    }
    for (const image of images) {
      const imageUrl = await uploadImage(image.tempFilePath);
      const imageDoc = await Image.create({
        user: userId,
        ratingAndReview: null,
        imageUrl,
        filename: image.name,
        size: image.size,
        mime: image.mimetype,
        type: "android",
      });
      imageIds.push(imageDoc._id);
    }
  }
  const reviewDoc = await Feedback.create({
    user: userId,
    brand: brandId,
    rating,
    review,
    imageIds,
  });
  if (imageIds.length > 0) {
    await Image.updateMany(
      { _id: { $in: imageIds } },
      { ratingAndReview: reviewDoc._id }
    );
  }
  return reviewDoc;
};
