const express = require("express");
const router = express.Router();
const { ROLES } = require("../constants");

const {
  addTodayOffer,
  getTodayOfferCategories,
} = require("../controller/todayOffer");
const { verifyToken, checkRole } = require("../middleware");

router.post("/add", verifyToken, checkRole(ROLES.ADMIN), addTodayOffer);
router.get(
  "/get-categories",
  verifyToken,
  checkRole(ROLES.USER),
  getTodayOfferCategories
);

module.exports = router;
