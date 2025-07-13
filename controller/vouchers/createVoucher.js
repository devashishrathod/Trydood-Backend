// const { ROLES } = require("../../constants");
// const { sendError, sendSuccess } = require("../../utils/response");

// exports.createVoucher = async (req, res) => {
//   try {
//     // const { error, value } = createVoucherSchema.validate(req.body);
//     // if (error) {
//     //   return res.status(400).json({ success: false, msg: error.message });
//     // }
//     const brandVendor = req?.payload?._id;
//     // const

//     //     subBrands :  arrays of object id
//     // title :
//     // maxDiscountAmount:
//     // minOrderAmount:
//     //     validFrom: { type: Date, required: true },
//     //     validTill: { type: Date, required: true },
//     // description:
//     // status: by default it take active
//     // if status in req.body as draft or any except active
//     // so publishedDate is not by default current date because by default it take date.now() also isPublished, and isActive are false in this condition

//     // extra validation validFrom is always less to validtill and also publisheddate not will be more than validTill and less than valid from ...are your understand user purpose logic for date
//     //     let payload = {
//     //       ...value,
//     //       code: value.code.toUpperCase(),
//     //     };

//     // Logic to set publishedDate, isPublished, isActive
//     if (value.status === "active") {
//       payload.publishedDate = new Date(); // only if not provided
//       payload.isPublished = true;
//       payload.isActive = true;
//     } else {
//       payload.publishedDate = undefined;
//       payload.isPublished = false;
//       payload.isActive = false;
//     }

//     const voucher = await createVoucher(payload);

//     return res
//       .status(201)
//       .json({ success: true, msg: "Voucher created successfully", voucher });
//   } catch (err) {
//     console.error("Create Voucher Error:", err);
//     return res.status(500).json({ success: false, msg: err.message });
//   }
// };
