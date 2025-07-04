const express = require("express");
const brandRouter = express.Router();

const { verifyToken, checkRole } = require("../middleware/authValidation");
const { getAllBrand, pagination } = require("../controller/brand");
const { addBrand, updateBrand } = require("../controller/vendors");
const { ROLES } = require("../constants");

brandRouter.post("/addBrand", addBrand);
brandRouter.put(
  "/update/:id",
  verifyToken,
  checkRole(ROLES.VENDOR),
  updateBrand
);
brandRouter.get("/getAll", getAllBrand);
brandRouter.get("/getOne/:id", getAllBrand);
brandRouter.get("/pagination", pagination);

//brandRouter.post("/add", verifyToken, checkRole("admin"), addBrand)

module.exports = brandRouter;
