const express = require("express");
const router = express.Router();
const { ROLES } = require("../constants");

const { addEmployee } = require("../controller/employees");
const { verifyToken, checkRole } = require("../middleware");

router.post("/add", verifyToken, checkRole(ROLES.ADMIN), addEmployee);

module.exports = router;
