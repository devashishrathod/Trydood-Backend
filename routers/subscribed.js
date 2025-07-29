const express = require("express");
const router = express.Router();
const { ROLES } = require("../constants");

const {
  getAllSubscribed,
  getCurrentSubscribed,
  subscribeToCoolingPlan,
} = require("../controller/subscribeds");

const {
  verifyToken,
  checkRole,
  loadBrand,
  validateObjectIds,
} = require("../middleware");

router.post(
  "/activateCoolingPlan",
  verifyToken,
  checkRole(ROLES.VENDOR),
  subscribeToCoolingPlan
);
router.get(
  "/getAll/:brandId",
  validateObjectIds(["brandId"]),
  verifyToken,
  checkRole(ROLES.ADMIN, ROLES.VENDOR),
  loadBrand,
  getAllSubscribed
);
router.get(
  "/getCurrentSubscription/:brandId",
  validateObjectIds(["brandId"]),
  verifyToken,
  checkRole(ROLES.ADMIN, ROLES.VENDOR),
  loadBrand,
  getCurrentSubscribed
);

module.exports = router;
