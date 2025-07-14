// const { getUserByFields } = require("../../service/userServices");

// exports.changeLoginMobileNumber = async (req, res) => {
//   try {
//     const user = req?.payload;
//     const previousMobile = user?.mobile;
//     let { whatsappNumber } = req.body;
//     whatsappNumber = whatsappNumber?.toLowerCase();
//     const checkUser = await getUserByFields({ mobile: whatsappNumber });
//     role = role?.toLowerCase() || "user";

//     let isFirst = false;
//     if (!checkUser) {
//       isFirst = true;
//       checkUser = new User({
//         mobile,
//         role,
//         uniqueId: await generateUniqueUserId(),
//         referCode: generateReferralCode(6),
//       });
//     }
//     checkUser.fcmToken = req.body?.fcmToken;
//     await checkUser.save();
//     let result = await urlSendTestOtp(mobile);
//     return res.status(200).json({
//       success: true,
//       msg: "OTP sent to your mobile number successfully.",
//       isFirst,
//       result,
//       user: checkUser,
//     });
//   } catch (error) {
//     console.log("error on login: ", error);
//     return res
//       .status(500)
//       .json({ error: error, success: false, msg: error.message });
//   }
// };
