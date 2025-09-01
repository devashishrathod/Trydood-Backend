const Refund = require("../../model/Refund");
const { pagination } = require("../../utils");

exports.getAllRefundRequests = async (query) => {
  let {
    page = 1,
    limit = 10,
    date,
    startDate,
    endDate,
    status,
    isApproved,
    brand,
    subBrand,
    voucher,
  } = query;
  page = page ? parseInt(page) : 1;
  limit = limit ? parseInt(limit) : 10;
  if (page < 1) page = 1;
  if (limit < 1) limit = 10;
  const match = { isDeleted: false };
  if (status) match.status = status;
  if (typeof isApproved !== "undefined") {
    if (isApproved === "true" || isApproved === true) match.isApproved = true;
    else if (isApproved === "false" || isApproved === false)
      match.isApproved = false;
  }
  if (brand) match.brand = new mongoose.Types.ObjectId(brand);
  if (subBrand) match.subBrand = new mongoose.Types.ObjectId(subBrand);
  if (voucher) match.voucher = new mongoose.Types.ObjectId(voucher);
  if (date) {
    const exactDate = new Date(date);
    const next = new Date(exactDate);
    next.setDate(next.getDate() + 1);
    match.createdAt = { $gte: exactDate, $lt: next };
  } else if (startDate && endDate) {
    match.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }
  const pipeline = [
    { $match: match },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "vouchers",
        localField: "voucher",
        foreignField: "_id",
        as: "voucher",
      },
    },
    { $unwind: { path: "$voucher", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "transactions",
        localField: "transaction",
        foreignField: "_id",
        as: "transaction",
      },
    },
    { $unwind: { path: "$transaction", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "bills",
        localField: "transaction.bill",
        foreignField: "_id",
        as: "bill",
      },
    },
    { $unwind: { path: "$bill", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 1,
        refundAmount: 1,
        reason: 1,
        status: 1,
        isApproved: 1,
        createdAt: 1,
        userId: "$user._id",
        userName: "$user.name",
        userImage: "$user.image",
        voucherId: "$voucher._id",
        voucherUniqueId: "$voucher.uniqueId",
        voucherTitle: "$voucher.title",
        transactionId: "$transaction._id",
        transactionCreatedAt: "$transaction.createdAt",
        paidAmount: "$transaction.paidAmount",
        orderId: "$transaction.razorpayOrderId",
        paymentMethod: "$transaction.paymentMethod",
        billAmount: "$bill.billAmount",
      },
    },
  ];
  return await pagination(Refund, pipeline, page, limit);
};
