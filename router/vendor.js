const express = require("express");
const vendorRouter = express.Router();

const { ROLES } = require("../constants");
const {
  registerVendor,
  addCategorySubCategory,
  addLocation,
  addWorking,
} = require("../controller/vendor");
const { verifyToken, checkRole } = require("../middleware/authValidation");

const { getAllVendors } = require("../controller/vendors");

vendorRouter.post("/register", registerVendor);
vendorRouter.get(
  "/getAllVendors",
  verifyToken,
  checkRole(ROLES.ADMIN),
  getAllVendors
);
vendorRouter.put(
  "/addCategorySubCategory/:id",
  verifyToken,
  checkRole("vendor"),
  addCategorySubCategory
); //id of brand
vendorRouter.put(
  "/addLocation/:id",
  verifyToken,
  checkRole("vendor"),
  addLocation
); //id of brand
vendorRouter.put(
  "/addWorkHours/:id",
  verifyToken,
  checkRole("vendor"),
  addWorking
); //id of brand

module.exports = vendorRouter;
