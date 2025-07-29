const Category = require("../../model/Category");
const { findOne } = require("../../db/dbServices");

exports.getCategoryById = async (id) => {
  return await findOne(Category, { _id: id, isDeleted: false });
};
