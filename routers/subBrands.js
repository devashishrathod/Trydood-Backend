const express = require("express");
const router = express.Router();
const { ROLES } = require("../constants");

const { verifyToken, checkRole } = require("../middleware/authValidation");
const {
  addSubBrand,
  updateSubBrand,
  getAllSubBrands,
  getAllSubBrandsOfBrand,
} = require("../controller/subBrands");

router.post(
  "/addSubBrandByVendorOrSubBrandUser/:brandId",
  verifyToken,
  checkRole(ROLES.VENDOR),
  addSubBrand
);
router.put(
  "/updateSubBrandByVendorOrSubBrandUser/:subBrandId",
  verifyToken,
  checkRole(ROLES.VENDOR, ROLES.SUB_VENDOR),
  updateSubBrand
);
router.get(
  "/getOne/:subBrandId",
  verifyToken,
  checkRole(ROLES.VENDOR, ROLES.SUB_VENDOR, ROLES.ADMIN),
  getAllSubBrands
);
router.get("/getAll", verifyToken, checkRole(ROLES.ADMIN), getAllSubBrands);
router.get(
  "/getAllSubBrandsOfBrand/:brandId",
  verifyToken,
  checkRole(ROLES.VENDOR, ROLES.ADMIN),
  getAllSubBrandsOfBrand
);

module.exports = router;
