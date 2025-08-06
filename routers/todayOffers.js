const express = require("express");
const router = express.Router();
const { ROLES } = require("../constants");

const { addTodayOffer } = require("../controller/todayOffer");
const { verifyToken, checkRole } = require("../middleware");

router.post("/add", verifyToken, checkRole(ROLES.ADMIN), addTodayOffer);

module.exports = router;
