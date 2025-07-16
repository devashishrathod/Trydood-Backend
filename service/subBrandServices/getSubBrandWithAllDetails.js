const SubBrand = require("../../model/SubBrand");

exports.getSubBrandWithAllDetails = async (id) => {
  return await SubBrand.findOne({ _id: id, isDeleted: false })
    .populate("user")
    .populate("location")
    .populate("workHours")
    .populate("brand");
  // .populate("category")
  // .populate("subCategory")
  // .populate("gst")
  // .populate("bankAccount")
  // .populate("transaction")
  // .populate("subscribed");
};
