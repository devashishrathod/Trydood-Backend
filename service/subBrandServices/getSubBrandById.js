const SubBrand = require("../../model/SubBrand");
const { findOne } = require("../../db/dbServices");

exports.getSubBrandById = async (id) => {
  return await findOne(SubBrand, { isDeleted: false, _id: id });
};
