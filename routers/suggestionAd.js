const express = require("express");
const router = express.Router();
const { ROLES } = require("../constants");

const { verifyToken, checkRole } = require("../middleware");
const { createSuggestionAd } = require("../controller/suggestionAds");

router.post(
  "/:voucherId/create",
  verifyToken,
  checkRole(ROLES.ADMIN),
  createSuggestionAd
);

module.exports = router;
