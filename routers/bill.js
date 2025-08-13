const express = require("express");
const router = express.Router();
const { ROLES } = require("../constants");

const { verifyToken, checkRole } = require("../middleware");
const { createBill } = require("../controller/bills");

router.post("/create", verifyToken, checkRole(ROLES.USER), createBill);

module.exports = router;
