// exports.loginMobile = async (req, res) => {
//   const mobile = req.body?.mobile;
//   const password = req.body?.password;
//   try {
//     const checkUser = await User.findOne({ mobile: mobile });
//     if (!checkUser) {
//       return res.status(401).json({
//         error: "Invalid credentials",
//         success: false,
//         msg: "User not found",
//       });
//     }
//     const matchedPass = await bcrypt.compare(password, checkUser.password);
//     if (!matchedPass) {
//       return res
//         .status(401)
//         .json({ success: false, msg: "Invalid credentials" });
//     }
//     const token = await generateToken(checkUser);
//     return res
//       .status(200)
//       .json({ success: true, msg: "User logged in successfully", token });
//   } catch (error) {
//     console.log("error on loginUser: ", error);
//     return res
//       .status(500)
//       .json({ error: error, success: false, msg: error.message });
//   }
// };
