const express = require("express");
const router = express.Router();
const authRouter = express.Router();
const profileRouter = express.Router();

const {
  loginEmail,
  registorUser,
  loginMobile,
  requistOtp,
  verifyOtp,
  userProfile,
  login,
  verifyVendorMobileNumber,
  verifyOTPVendorMobile,
} = require("../controller/user");

const { userProfileComplete } = require("../controller/users/updateUser");
const { verifyToken } = require("../middleware/authValidation");
const { isFirst } = require("../middleware/helper");
const {
  logout,
  changeLoginMobileNumber,
  verifyChangeMobile,
} = require("../controller/users");

router.post("/register", registorUser);
router.post("/loginEmail", loginEmail);
router.post("/loginMobile", loginMobile);
router.post("/requistOtp", requistOtp);
router.post("/vendorMobileVerify", verifyVendorMobileNumber);
router.post("/vendorOTPVerify", verifyOTPVendorMobile);
router.post("/login", login);
router.post("/verifyOtp", verifyOtp);
router.put("/logout", verifyToken, logout);
router.put("/changeMobile", verifyToken, changeLoginMobileNumber);
router.put("/verifyChangeMobile", verifyToken, verifyChangeMobile);
/* ================= Enhance route with "auth/login" ================== */
// authRouter.post("/register", registorUser);
// authRouter.post("/loginEmail", loginEmail);
// authRouter.post("/loginMobile", loginMobile);
// authRouter.post("/requistOtp", requistOtp);
// authRouter.post("/verifyOtp", verifyOtp);
// authRouter.post("/vendorMobileVerify", verifyVendorMobileNumber);
// authRouter.post("/vendorOTPVerify", verifyOTPVendorMobile);
// authRouter.post("/login", login);
// authRouter.put("/logout", verifyToken, logout);

/* ================= Profile route with "/profile/" ================== */
router.get("/userProfile", verifyToken, userProfile);
//profileRouter.get("/userProfile", verifyToken, userProfile);
router.put("/userProfile/update", verifyToken, userProfileComplete);
//profileRouter.put("/userProfile/update", verifyToken, userProfileComplete);
router.put("/userProfileComplete", [verifyToken, isFirst], userProfileComplete);
/*profileRouter.put(
  "/userProfileComplete",
  [verifyToken, isFirst],
  userProfileComplete
);*/

module.exports = {
  router,
  //routePrefix: "/user", // default
  extraRoutes: [
    { path: "/auth", router: authRouter }, // mount /api/auth/*
    { path: "/profile", router: profileRouter },
  ],
};
