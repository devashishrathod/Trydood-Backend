const Category = require("../../model/Category");
const { findById } = require("../../db/dbServices");

exports.getCategoryById = async (id) => {
  return await findById(Category, id);
};
