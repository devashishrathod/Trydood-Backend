const razorpay = require("../../configs/rajorPay");
const { PAYMENT_STATUS } = require("../../constants");
const { sendSuccess, sendError } = require("../../utils");
const { createTransaction } = require("../../service/transactionServices");

// create order and get order Id for payment
exports.createOrder = async (req, res) => {
  try {
    const { amount, paymentMethod, userId, currency } = req.body;
    const receipt = `rcpt_${userId.toString().slice(-6)}_${Date.now()
      .toString()
      .slice(-6)}`;

    const options = {
      amount: amount * 100,
      currency: currency ? currency : "INR",
      receipt: receipt,
    };
    const order = await razorpay.orders.create(options);
    const transaction = await createTransaction({
      userId,
      amount,
      paymentMethod,
      currency: "INR",
      status: PAYMENT_STATUS.CREATED,
      razorpayOrderId: order.id,
      receipt: order.receipt,
    });
    return sendSuccess(res, 201, "Order created successfully", {
      order,
      transaction,
    });
  } catch (error) {
    console.log("error", error);
    return sendError(res, 500, error.message);
  }
};
