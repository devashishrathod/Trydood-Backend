const express = require("express");
const router = express.Router();
const { ROLES } = require("../constants");

const { verifyToken, checkRole } = require("../middleware/authValidation");
const { addSubBrand, updateSubBrand } = require("../controller/subBrands");

router.post(
  "/addSubBrandByVendorOrSubBrandUser/:brandId",
  verifyToken,
  checkRole(ROLES.VENDOR, ROLES.SUB_VENDOR),
  addSubBrand
);
router.put(
  "/updateSubBrandByVendorOrSubBrandUser/:subBrandId",
  verifyToken,
  checkRole(ROLES.VENDOR, ROLES.SUB_VENDOR),
  updateSubBrand
);

module.exports = router;
