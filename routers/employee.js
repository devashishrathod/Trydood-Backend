const express = require("express");
const router = express.Router();
const { ROLES } = require("../constants");

const { addEmployee, deleteEmployee } = require("../controller/employees");
const { verifyToken, checkRole } = require("../middleware");

router.post("/add", verifyToken, checkRole(ROLES.ADMIN), addEmployee);
router.delete(
  "/:id/delete",
  verifyToken,
  checkRole(ROLES.ADMIN),
  deleteEmployee
);

module.exports = router;
