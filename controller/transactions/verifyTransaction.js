const crypto = require("crypto");
const {
  updateTransactionByOrderAndUserId,
} = require("../../service/transactionServices");
const { sendError, sendSuccess } = require("../../utils");
const { PAYMENT_STATUS } = require("../../constants");

exports.verifyTransaction = async (req, res) => {
  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      userId,
      paymentMethod,
      walletProvider,
    } = req.body;
    if (
      !razorpayOrderId ||
      !razorpayPaymentId ||
      !razorpaySignature ||
      !userId
    ) {
      return sendError(res, 422, "Missing required fields");
    }
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");
    const isValidSignature = generatedSignature === razorpaySignature;
    if (!isValidSignature) {
      return sendError(res, 400, "Invalid signature. Payment may be tampered.");
    }
    const transaction = await updateTransactionByOrderAndUserId(
      { razorpayOrderId, user: userId },
      {
        status: PAYMENT_STATUS.PAID,
        razorpayPaymentId,
        razorpaySignature,
        verified: true,
        paymentMethod: paymentMethod,
        walletProvider: paymentMethod === "wallet" ? walletProvider : undefined,
      }
    );
    if (!transaction) return sendError(res, 404, "Transaction not found");
    return sendSuccess(res, 200, "Payment verified", transaction);
  } catch (error) {
    console.error("Payment verification error:", error);
    return sendError(res, 500, error.message);
  }
};
