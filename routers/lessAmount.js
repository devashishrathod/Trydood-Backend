const express = require("express");
const router = express.Router();
const { ROLES } = require("../constants");

const { verifyToken, checkRole } = require("../middleware");
const { createLessAmount } = require("../controller/lessAmount");

router.post("/create", verifyToken, checkRole(ROLES.ADMIN), createLessAmount);

module.exports = router;
