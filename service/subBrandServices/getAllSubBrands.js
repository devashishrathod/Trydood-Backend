const SubBrand = require("../../model/SubBrand");
const { findMany } = require("../../db/dbServices");

exports.getAllSubBrands = async (sort) => {
  return await findMany(SubBrand, { isDeleted: false }, {}, { sort }).populate(
    "user brand location workHours"
  );
};
