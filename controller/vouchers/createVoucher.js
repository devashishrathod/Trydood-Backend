const { addVoucher } = require("../../service/voucherServices");
const { sendSuccess, sendError } = require("../../utils");

exports.createVoucher = async (req, res) => {
  try {
    const brandId = req.params?.brandId;
    const createdBy = req.payload?._id;
    const brandUserId = req.brand?.user?._id;
    let {
      subBrandIds,
      title,
      description,
      type,
      status,
      value,
      maxDiscountAmount,
      minOrderAmount,
      usageLimit,
      validFrom,
      validTill,
      publishedDate,
      time,
    } = req.body;

    const voucher = await addVoucher(req.body, createdBy, brandId, brandUserId);
    return sendSuccess(res, 201, "Voucher created successfully", voucher);
  } catch (error) {
    return sendError(
      res,
      error.statusCode || 500,
      error.message || "Failed to create voucher",
      error
    );
  }
};
