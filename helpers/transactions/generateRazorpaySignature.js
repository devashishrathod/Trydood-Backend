const crypto = require("crypto");

exports.generateRazorpaySignature = (orderId, paymentId) => {
  return crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
};
