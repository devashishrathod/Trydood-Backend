const Voucher = require("../../model/Voucher");
const { createItem } = require("../../db/dbServices");

exports.createVoucher = async (payload) => {
  return await createItem(Voucher, payload);
};
