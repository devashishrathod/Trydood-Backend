const express = require("express");
const router = express.Router();
const { ROLES } = require("../constants");

const { verifyToken, checkRole } = require("../middleware/authValidation");

const {
  createImageForBrandOrSubBrand,
  getImagesFromFieldOfEntity,
} = require("../controller/images");

router.post(
  "/addImage",
  verifyToken,
  checkRole(ROLES.ADMIN, ROLES.VENDOR),
  createImageForBrandOrSubBrand
);

router.get(
  "/getAllImages/:entityId",
  verifyToken,
  checkRole(ROLES.ADMIN, ROLES.VENDOR),
  getImagesFromFieldOfEntity
);

module.exports = router;
