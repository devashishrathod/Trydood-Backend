const express = require("express");
const userRouter = express.Router();

const {
  loginEmail,
  registorUser,
  loginMobile,
  requistOtp,
  verifyOtp,
  userProfile,
  login,
  // userProfileComplete,
  verifyVendorMobileNumber,
  verifyOTPVendorMobile,
} = require("../controller/user");
const { userProfileComplete } = require("../controller/users/updateUser");
const { verifyToken } = require("../middleware/authValidation");
const { isFirst } = require("../middleware/helper");
const { logout } = require("../controller/users");

userRouter.get("/userProfile", verifyToken, userProfile);

userRouter.post("/register", registorUser);
userRouter.post("/loginEmail", loginEmail);
userRouter.post("/loginMobile", loginMobile);

userRouter.post("/requistOtp", requistOtp);
userRouter.post("/verifyOtp", verifyOtp);
userRouter.post("/vendorMobileVerify", verifyVendorMobileNumber);
userRouter.post("/vendorOTPVerify", verifyOTPVendorMobile);

userRouter.post("/login", login);

userRouter.put("/userProfile/update", verifyToken, userProfileComplete);
userRouter.put(
  "/userProfileComplete",
  [verifyToken, isFirst],
  userProfileComplete
);
userRouter.put("/logout", verifyToken, logout);
module.exports = userRouter;
