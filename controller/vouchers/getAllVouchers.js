const { getVouchers } = require("../../service/voucherServices");
const { sendSuccess, sendError } = require("../../utils");

exports.getAllVouchers = async (req, res) => {
  try {
    const filters = req.query;
    const result = await getVouchers(filters);
    return sendSuccess(res, 200, "Vouchers fetched successfully", result);
  } catch (error) {
    console.error("Get All Vouchers Error:", error);
    return sendError(res, 500, error);
  }
};
