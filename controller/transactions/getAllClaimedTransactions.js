const {
  getClaimedVouchersByUser,
} = require("../../service/transactionServices");
const { sendSuccess, sendError } = require("../../utils");

exports.getAllClaimedTransactions = async (req, res) => {
  try {
    const data = await getClaimedVouchersByUser(req.query);
    if (!data || !data?.data?.length) {
      return sendError(res, 404, "No any voucher claimed yet");
    }
    return sendSuccess(res, 200, "Claimed vouchers fetched", data);
  } catch (error) {
    console.log("error on fetching user voucher claimed ", error);
    return sendError(res, 500, error.message || "Something went wrong");
  }
};
