const { sendSuccess, sendError } = require("../../utils");
const { getAllReviews } = require("../../service/feedbackServices");

exports.getAllFeedbacks = async (req, res) => {
  try {
    const result = await getAllReviews(req.query);
    if (!result || !result?.data?.length) {
      return sendError(res, 404, "No any feedback / reviewed yet");
    }
    return sendSuccess(res, 200, "All feedbacks retrieve successfully", result);
  } catch (error) {
    console.log("error on fetching feedbacks / reviews", error);
    return sendError(res, error.statusCode || 500, error.message);
  }
};
