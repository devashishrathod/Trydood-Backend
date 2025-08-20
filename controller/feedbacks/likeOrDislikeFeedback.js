const { toggleFeedbackLike } = require("../../service/feedbackServices");
const { sendSuccess, sendError } = require("../../utils");

exports.likeOrDislikeFeedback = async (req, res) => {
  try {
    const { feedbackId } = req.params;
    const userId = req.payload?._id;
    const result = await toggleFeedbackLike(userId, feedbackId);
    return sendSuccess(res, 200, result.liked ? "Liked" : "Disliked", result);
  } catch (err) {
    console.log("Error on like or dislike feedback", err);
    return sendError(res, err.statusCode || 500, err);
  }
};
