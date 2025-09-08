const { createReview } = require("./createReview");
const { getAllReviews } = require("./getAllReviews");
const { toggleFeedbackLike } = require("./toggleFeedbackLike");
const { replyToFeedbackByVendor } = require("./replyToFeedbackByVendor");

module.exports = {
  createReview,
  getAllReviews,
  toggleFeedbackLike,
  replyToFeedbackByVendor,
};
