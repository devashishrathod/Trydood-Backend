const User = require("../../model/User");
const { findOne } = require("../../db/dbServices");

exports.getUserByFields = async (fieldsData) => {
  return await findOne(User, fieldsData);
};
