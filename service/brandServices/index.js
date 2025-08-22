const { generateUniqueBrandId } = require("./generateUniqueBrandId");
const { getBrandByName } = require("./getBrandByName");
const { createBrand } = require("./createBrand");
const { getBrandByUserAndVendorId } = require("./getBrandByUserAndVendorId");
const { getBrandById } = require("./getBrandById");
const { updateBrandById } = require("./updateBrandById");
const { addSubBrandsToBrand } = require("./addSubBrandsToBrand");
const { getBrandWithAllDetails } = require("./getBrandWithAllDetails");
const { toggleBrandFollow } = require("./toggleBrandFollow");

module.exports = {
  getBrandById,
  updateBrandById,
  generateUniqueBrandId,
  createBrand,
  getBrandByName,
  getBrandByUserAndVendorId,
  addSubBrandsToBrand,
  getBrandWithAllDetails,
  toggleBrandFollow,
};
