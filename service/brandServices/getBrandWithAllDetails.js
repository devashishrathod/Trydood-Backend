const Brand = require("../../model/Brand");

exports.getBrandWithAllDetails = async (id) => {
  return await Brand.findOne({ _id: id, isDeleted: false }).populate(
    "user category subCategory gst location workHours bankAccount transaction subscribed"
  );
  // .populate("category")
  // .populate("subCategory")
  // .populate("location")
  // .populate("gst")
  // .populate("workHours")
  // .populate("bankAccount")
  // .populate("transaction")
  // .populate("subscribed");
};
