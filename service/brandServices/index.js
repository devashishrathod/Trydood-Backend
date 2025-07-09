const { generateUniqueBrandId } = require("./generateUniqueBrandId");
const { getBrandByName } = require("./getBrandByName");
const { createBrand } = require("./createBrand");
const { getBrandByUserAndVendorId } = require("./getBrandByUserAndVendorId");
const { getBrandById } = require("./getBrandById");
const { addSubBrandsToBrand } = require("./addSubBrandsToBrand");
const { getBrandWithAllDetails } = require("./getBrandWithAllDetails");

module.exports = {
  getBrandById,
  generateUniqueBrandId,
  createBrand,
  getBrandByName,
  getBrandByUserAndVendorId,
  addSubBrandsToBrand,
  getBrandWithAllDetails,
};
