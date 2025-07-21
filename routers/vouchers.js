const express = require("express");
const router = express.Router();
const { ROLES } = require("../constants");

const { createVoucher } = require("../controller/vouchers");
const { verifyToken, checkRole, loadBrand } = require("../middleware");

router.post(
  "/add/:brandId",
  verifyToken,
  checkRole(ROLES.ADMIN, ROLES.VENDOR),
  loadBrand,
  createVoucher
);

module.exports = router;
