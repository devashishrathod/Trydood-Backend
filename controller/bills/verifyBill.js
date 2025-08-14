const Bill = require("../../model/Bill");
const { sendError, sendSuccess } = require("../../utils");
const { getUserById } = require("../../service/userServices");
const {
  getTransactionById,
  updateTransactionByOrderAndUserId,
} = require("../../service/transactionServices");
const {
  generateRazorpaySignature,
  getPaymentDetails,
  generateAndUploadInvoice,
} = require("../../helpers/transactions");

// verifyPayment and add subscription
exports.verifyBill = async (req, res) => {
  try {
    const createdUserId = req.payload?._id;
    const checkUser = await getUserById(createdUserId);
    if (!checkUser) return sendError(res, 404, "User not found!");
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      transactionId,
    } = req.body;
    if (
      !razorpayOrderId ||
      !razorpayPaymentId ||
      !razorpaySignature ||
      !transactionId
    ) {
      return sendError(res, 422, "Missing required fields");
    }
    const checkTxn = await getTransactionById(transactionId);
    if (!checkTxn) return sendError(res, 404, "User transaction not found!");

    const { user, createdBy, bill } = checkTxn;
    if (createdUserId.toString() !== createdBy.toString()) {
      return sendError(
        res,
        404,
        "You are not authorized to verify this payment request"
      );
    }
    const userBill = await Bill.findOne({
      _id: bill,
      isDeleted: false,
      isVerified: false,
    });
    if (!userBill) return sendError(res, 404, "Bill not found");

    const generatedSignature = generateRazorpaySignature(
      razorpayOrderId,
      razorpayPaymentId
    );
    const isValidSignature = generatedSignature === razorpaySignature;
    if (!isValidSignature) {
      return sendError(res, 400, "Invalid signature. Payment may be tampered.");
    }
    const paymentDetails = await getPaymentDetails(razorpayPaymentId);
    if (!paymentDetails) {
      return sendError(
        res,
        503,
        "Razorpay services unavailable! Please try again later"
      );
    }
    const updatedTxnData = {
      entity: paymentDetails?.entity,
      description: paymentDetails?.description,
      status: paymentDetails?.status,
      razorpayPaymentId,
      razorpaySignature,
      verified: paymentDetails?.captured,
      paidAmount: paymentDetails?.amount / 100,
      dueAmount: checkSubscription?.price - paymentDetails?.amount / 100,
      amountRefunded: (paymentDetails?.amount_refunded ?? 0) / 100,
      refundStatus: paymentDetails?.refund_status,
      isInternational: paymentDetails?.international,
      paymentMethod: paymentDetails?.method,
      walletProvider: paymentDetails?.wallet,
      fee: paymentDetails?.fee,
      tax: paymentDetails?.tax,
      cardId: paymentDetails?.card_id,
      bank: paymentDetails?.bank,
      vpa: paymentDetails?.vpa,
      notes: paymentDetails?.notes,
      errorCode: paymentDetails?.error_code,
      errorDescription: paymentDetails?.error_description,
      errorSource: paymentDetails?.error_source,
      errorStep: paymentDetails?.error_step,
      errorReason: paymentDetails?.error_reason,
      acquirerData: paymentDetails?.acquirer_data,
      updatedAtRaw: paymentDetails?.created_at,
    };
    const updateTxn = await updateTransactionByOrderAndUserId(
      { _id: transactionId, user: user, razorpayOrderId },
      updatedTxnData
    );
    if (!updateTxn) return sendError(res, 404, "Transaction update failed");
    if (updateTxn?.verified) {
      const invoiceData = {
        invoiceId: updateTxn.invoiceId,
        transaction: updateTxn._id.toString(),
        planName: checkSubscription?.name,
        price: updateTxn.paidAmount,
        date: new Date(startDate).toLocaleDateString("en-IN"),
        planEnd: new Date(endDate).toLocaleDateString("en-IN"),
        status: updateTxn.status,
        paymentMethod: updateTxn.paymentMethod,
      };
      const invoiceUrl = await generateAndUploadInvoice(invoiceData);
      console.log("Invoice URL:", invoiceUrl);
      const finalTxn = await updateTransactionByOrderAndUserId(
        { _id: transactionId, user: user, razorpayOrderId },
        { invoiceUrl }
      );
      console.log("Final Transaction:", finalTxn);
      const updatedBill = await Bill.findOneAndUpdate(
        { _id: bill, isDeleted: false, isVerified: false },
        { isVerified: true }
      );
      if (updatedBill) {
        await voucher.updateOne({
          $addToSet: { claimedUsers: { user, claimedAt: new Date() } },
        });
        if (
          Array.isArray(updatedBill?.appliedOffers) &&
          updatedBill.appliedOffers.length
        ) {
          for (const offer of updatedBill.appliedOffers) {
            let offerDoc = null;
            if (offer.offerType === "PromoCode") {
              offerDoc = await PromoCode.findById(offer.offerId);
            } else if (offer.offerType === "LessAmount") {
              offerDoc = await LessAmount.findById(offer.offerId);
            }
            if (offerDoc) {
              await offerDoc.updateOne({
                $addToSet: { claimedUsers: { user, claimedAt: new Date() } },
              });
            }
          }
        }
      } else {
        return sendError(res, 400, "User bill updation failed");
      }
    } else {
      return sendError(
        res,
        updateTxn?.errorCode || 400,
        updateTxn?.errorReason || "User transaction updation failed"
      );
    }
    return sendSuccess(
      res,
      200,
      "Payment successful! Congratulations — your bill payment has been successfully",
      { brand: SubscribedBrand }
    );
  } catch (error) {
    console.error("Payment verification error:", error);
    return sendError(res, 500, error.message);
  }
};
