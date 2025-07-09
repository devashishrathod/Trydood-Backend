const Brand = require("../../model/Brand");

exports.getBrandWithAllDetails = async (id) => {
  return await Brand.findOne({ _id: id, isDeleted: false })
    .populate("category")
    .populate("subCategory")
    .populate("location")
    .populate("workHours")
    .populate("bankAccount");
};
