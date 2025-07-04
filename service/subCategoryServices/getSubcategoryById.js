const SubCategory = require("../../model/SubCategory");
const { findById } = require("../../db/dbServices");

exports.getSubCategoryById = async (id) => {
  return await findById(SubCategory, id);
};
