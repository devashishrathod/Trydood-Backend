const express = require("express");
const router = express.Router();
const { ROLES } = require("../constants");

const {
  createVoucher,
  getAllVouchers,
  getVoucher,
  updateVoucher,
} = require("../controller/vouchers");
const { verifyToken, checkRole, loadBrand } = require("../middleware");

router.post(
  "/add/:brandId",
  verifyToken,
  checkRole(ROLES.VENDOR),
  loadBrand,
  createVoucher
);
router.get(
  "/getAll",
  verifyToken,
  checkRole(ROLES.ADMIN, ROLES.VENDOR, ROLES.SUB_VENDOR),
  getAllVouchers
);
router.get(
  "/get/:voucherId",
  verifyToken,
  checkRole(ROLES.ADMIN, ROLES.VENDOR, ROLES.SUB_VENDOR),
  getVoucher
);
router.put("/update/:id", verifyToken, checkRole(ROLES.VENDOR), updateVoucher);

module.exports = router;
