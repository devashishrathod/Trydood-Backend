const SubBrand = require("../../model/SubBrand");
const { findMany } = require("../../db/dbServices");

exports.getAllSubBrandsOfOneBrand = async (brandId) => {
  const filter = { isDeleted: false, brand: brandId };
  return await findMany(SubBrand, filter);
};
