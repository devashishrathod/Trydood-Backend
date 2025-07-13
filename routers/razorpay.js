const express = require("express");
const router = express.Router();

const { verifyToken, checkRole } = require("../middleware/authValidation");
const {
  createOrder,
  verifyTransaction,
} = require("../controller/transactions");
const { ROLES } = require("../constants");

router.post(
  "/create-order",
  verifyToken,
  checkRole(ROLES.ADMIN, ROLES.VENDOR),
  createOrder
);
router.put(
  "/verifyPayment",
  verifyToken,
  checkRole(ROLES.ADMIN, ROLES.VENDOR),
  verifyTransaction
);

module.exports = router;
