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
router.get("/getAll", verifyToken, getAllVouchers);
router.get("/get/:voucherId", verifyToken, getVoucher);
router.put("/update/:id", verifyToken, checkRole(ROLES.VENDOR), updateVoucher);

module.exports = router;
