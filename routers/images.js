const express = require("express");
const router = express.Router();
const { ROLES } = require("../constants");

const { verifyToken, checkRole } = require("../middleware/authValidation");

const {
  createImageForBrandOrSubBrand,
  getImagesForBrandOrSubBrand,
} = require("../controller/images");

router.post(
  "/addImage",
  verifyToken,
  checkRole(ROLES.ADMIN, ROLES.VENDOR, ROLES.SUB_VENDOR),
  createImageForBrandOrSubBrand
);

router.get(
  "/getAllImages/:entityId",
  verifyToken,
  checkRole(ROLES.ADMIN, ROLES.VENDOR, ROLES.SUB_VENDOR),
  getImagesForBrandOrSubBrand
);

module.exports = router;
