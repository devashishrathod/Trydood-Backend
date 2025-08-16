const {
  getClaimedVouchersByUser,
} = require("../../service/transactionServices");
const { sendSuccess, sendError } = require("../../utils");

exports.getAllClaimedTransactions = async (req, res) => {
  try {
    const userId = req.payload._id;
    const data = await getClaimedVouchersByUser(userId, req.query);
    if (!data) return sendError(res, 404, "No any voucher claimed yet");
    return sendSuccess(res, 200, "Claimed vouchers fetched", data);
  } catch (error) {
    console.log("error on fetching user voucher claimed ", error);
    return sendError(res, error.message || "Something went wrong");
  }
};
