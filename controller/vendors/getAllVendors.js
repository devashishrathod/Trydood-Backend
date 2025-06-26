const User = require("../../model/User");
const { ROLES } = require("../../constants");

const getAllVendors = async (req, res) => {
  const id = req?.params?.id;
  try {
    if (id) {
      const result = await User.findById(id).populate("brand");
      if (result) {
        return res
          .status(200)
          .json({ success: true, msg: "Vendor details", result });
      }
      return res.status(404).json({ msg: "Vendor not found", success: false });
    }
    const result = await User.find({ role: ROLES.VENDOR })
      .sort({ createdAt: -1 })
      .populate("brand");
    if (result) {
      return res
        .status(200)
        .json({ success: true, msg: "Vendor details", result });
    }
    return res.status(404).json({ msg: "Vendor not found", success: false });
  } catch (error) {
    console.log("error on getAllVendors: ", error);
    return res
      .status(500)
      .json({ error: error, success: false, msg: error.message });
  }
};

module.exports = { getAllVendors };
