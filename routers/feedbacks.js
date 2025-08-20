const express = require("express");
const router = express.Router();
const { ROLES } = require("../constants");

const { verifyToken, checkRole } = require("../middleware");
const {
  createFeedback,
  getAllFeedbacks,
  likeOrDislikeFeedback,
  replyToFeedback,
} = require("../controller/feedbacks");

router.post(
  "/create-review/:brandId",
  verifyToken,
  checkRole(ROLES.USER),
  createFeedback
);
router.get("/getAll/reviews", verifyToken, getAllFeedbacks);
router.put("/:feedbackId/toggle-like", verifyToken, likeOrDislikeFeedback);
router.post(
  "/:feedbackId/reply",
  verifyToken,
  checkRole(ROLES.VENDOR),
  replyToFeedback
);

module.exports = router;
