const express = require("express");
const router = express.Router();
const { ROLES } = require("../constants");

const { verifyToken, checkRole } = require("../middleware");
const {
  getAllTransactions,
  getCurrentTransaction,
  getAllClaimedTransactions,
} = require("../controller/transactions");

router.get(
  "/getAll",
  verifyToken,
  checkRole(ROLES.ADMIN, ROLES.VENDOR),
  getAllTransactions
);
router.get(
  "/getCurrent",
  verifyToken,
  checkRole(ROLES.ADMIN, ROLES.VENDOR),
  getCurrentTransaction
);
router.get(
  "/get-all-claimed-vouchers",
  verifyToken,
  checkRole(ROLES.USER),
  getAllClaimedTransactions
);

module.exports = router;
