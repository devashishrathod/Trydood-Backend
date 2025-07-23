const express = require("express");
const router = express.Router();
const { ROLES } = require("../constants");

const { createVoucher, getAllVouchers } = require("../controller/vouchers");
const { verifyToken, checkRole, loadBrand } = require("../middleware");

router.post(
  "/add/:brandId",
  verifyToken,
  checkRole(ROLES.ADMIN, ROLES.VENDOR),
  loadBrand,
  createVoucher
);
router.get(
  "/getAll",
  verifyToken,
  checkRole(ROLES.ADMIN, ROLES.VENDOR, ROLES.SUB_VENDOR),
  getAllVouchers
);

module.exports = router;
