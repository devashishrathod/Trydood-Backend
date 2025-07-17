const { generateUniqueSubBrandId } = require("./generateUniqueSubBrandId");
const { createSubBrand } = require("./createSubBrand");
const { getSubBrandById } = require("./getSubBrandById");
const { getSubBrandByFields } = require("./getSubBrandByFields");
const { getAllSubBrandsOfOneBrand } = require("./getAllSubBrandsOfOneBrand");
const { getSubBrandWithAllDetails } = require("./getSubBrandWithAllDetails");
const { getAllSubBrands } = require("./getAllSubBrands");

module.exports = {
  createSubBrand,
  generateUniqueSubBrandId,
  getSubBrandById,
  getAllSubBrands,
  getSubBrandByFields,
  getAllSubBrandsOfOneBrand,
  getSubBrandWithAllDetails,
};
