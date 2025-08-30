const express = require("express");
const router = express.Router();
const { ROLES } = require("../constants");

const { verifyToken, checkRole } = require("../middleware");
const { raiseRefundRequest, getAllRefunds } = require("../controller/refunds");

router.post(
  "/raise-refund-request",
  verifyToken,
  checkRole(ROLES.USER),
  raiseRefundRequest
);
router.get("/get-all-refunds", verifyToken, getAllRefunds);

module.exports = router;
