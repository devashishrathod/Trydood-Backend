const express = require("express");
const router = express.Router();
const { ROLES } = require("../constants");

const { verifyToken, checkRole } = require("../middleware");
const { createRatingAndReview } = require("../controller/ratingAndReviews");

router.post(
  "/create-review/:brandId",
  verifyToken,
  checkRole(ROLES.USER),
  createRatingAndReview
);

module.exports = router;
