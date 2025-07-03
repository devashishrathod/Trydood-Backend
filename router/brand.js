const express = require("express");
const brandRouter = express.Router();

const { verifyToken, checkRole } = require("../middleware/authValidation");
const { getAllBrand, pagination } = require("../controller/brand");
const { addBrand } = require("../controller/vendors");
const { ROLES } = require("../constants");

brandRouter.post("/addBrand", verifyToken, checkRole(ROLES.VENDOR), addBrand);
brandRouter.get("/getAll", getAllBrand);
brandRouter.get("/getOne/:id", getAllBrand);
brandRouter.get("/pagination", pagination);

//brandRouter.post("/add", verifyToken, checkRole("admin"), addBrand)

module.exports = brandRouter;
