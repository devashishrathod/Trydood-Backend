const FeedbackLike = require("../../model/FeedbackLike");

exports.toggleFeedbackLike = async (userId, feedbackId) => {
  const existing = await FeedbackLike.findOne({
    user: userId,
    feedback: feedbackId,
  });
  if (existing && !existing.isDeleted) {
    await FeedbackLike.updateOne({ _id: existing._id }, { isDeleted: true });
    return { liked: false };
  }
  if (existing && existing.isDeleted) {
    await FeedbackLike.updateOne({ _id: existing._id }, { isDeleted: false });
    return { liked: true };
  }
  await FeedbackLike.create({ user: userId, feedback: feedbackId });
  return { liked: true };
};
