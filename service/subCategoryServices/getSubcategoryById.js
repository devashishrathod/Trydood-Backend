const SubCategory = require("../../model/SubCategory");
const { findOne } = require("../../db/dbServices");

exports.getSubCategoryById = async (id) => {
  return await findOne(SubCategory, { _id: id, isDeleted: false });
};
