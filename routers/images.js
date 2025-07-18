const express = require("express");
const router = express.Router();
const { ROLES } = require("../constants");

const { verifyToken, checkRole } = require("../middleware/authValidation");

const { createImageForBrandOrSubBrand } = require("../controller/images");

router.post(
  "/addImage",
  verifyToken,
  checkRole(ROLES.ADMIN, ROLES.VENDOR),
  createImageForBrandOrSubBrand
);

module.exports = router;
