const express = require("express");
const router = express.Router();
const { ROLES } = require("../constants");

const { verifyToken, checkRole } = require("../middleware/authValidation");
const { addSubBrand } = require("../controller/subBrands");

router.post(
  "/addSubBrandByVendorOrSubBrandUser/:brandId",
  verifyToken,
  checkRole(ROLES.VENDOR, ROLES.SUB_VENDOR),
  addSubBrand
);

module.exports = router;
