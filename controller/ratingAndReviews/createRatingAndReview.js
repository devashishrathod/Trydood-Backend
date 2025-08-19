const { createReview } = require("../../service/ratingAndReviewServices");
const { sendSuccess, sendError } = require("../../utils");

exports.createRatingAndReview = async (req, res) => {
  try {
    const userId = req.payload?._id;
    const brandId = req.params.brandId;
    const { rating, review } = req.body;
    const images = req.files?.images;
    const result = await createReview(
      userId,
      brandId,
      Number(rating),
      review,
      images
    );
    return sendSuccess(res, 201, "Review created successfully", result);
  } catch (error) {
    console.log("error on creating review.... ", error);
    const statusCode = error.statusCode || 500;
    return sendError(res, statusCode, error.message);
  }
};
