const { generateUniqueBrandId } = require("./generateUniqueBrandId");
const { getBrandByName } = require("./getBrandByName");
const { createBrand } = require("./createBrand");

module.exports = { generateUniqueBrandId, createBrand, getBrandByName };
