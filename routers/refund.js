const express = require("express");
const router = express.Router();
const { ROLES } = require("../constants");

const { verifyToken, checkRole } = require("../middleware");
const { raiseRefundRequest } = require("../controller/refunds");

router.post(
  "/raise-refund-request",
  verifyToken,
  checkRole(ROLES.USER),
  raiseRefundRequest
);

module.exports = router;
