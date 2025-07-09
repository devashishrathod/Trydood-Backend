const razorpay = require("../../configs/rajorPay");
const { createTransaction } = require("../../service/transactionServices");
const { PAYMENT_STATUS } = require("../../constants");

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

    res.status(200).json({ success: true, order, transaction });
  } catch (err) {
    console.log("error", err);
    res.status(500).json({ success: false, error: err.message });
  }
};
