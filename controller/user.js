const { generateToken } = require("../middleware/authValidation");
const User = require("../model/User");
const { uploadToCloudinary } = require("../service/uploadImage");
const bcrypt = require("bcryptjs");
const { generateReferralCode, sendError } = require("../utils");
const Location = require("../model/Location");
const { urlVerifyOtp, urlSendTestOtp } = require("../service/sendOTP");
const { calculateProfileCompletion } = require("../utils/utils");
const { generateUniqueUserId } = require("../service/userServices");
const { ROLES } = require("../constants");
let salt = 10;

exports.userProfile = async (req, res) => {
  const id = req.payload?._id;
  try {
    const result = await User.findById(id)
      .select("-password -__v -role")
      .populate("location")
      .populate("bankAccount");

    const completion = calculateProfileCompletion(result);
    if (result) {
      return res
        .status(200)
        .json({ success: true, msg: "User details", result, completion });
    }
    return res.status(404).json({ msg: "User not found", success: false });
  } catch (error) {
    console.log("error on userProfile: ", error);
    return res
      .status(500)
      .json({ error: error, success: false, msg: error.message });
  }
};

exports.registorUser = async (req, res) => {
  const name = req.body?.name;
  const email = req.body?.email;
  const mobile = req.body?.mobile;
  const password = req.body?.password;
  const role = req.body?.role;
  const address = req.body?.address;
  const image = req.files?.image;

  try {
    const checkUser = await User.findOne({ $or: [{ email }, { mobile }] });
    if (checkUser) {
      return res
        .status(400)
        .json({ success: false, msg: "Email or Mobile Number already exists" });
    }
    const hashedPass = await bcrypt.hash(password, parseInt(salt));
    if (!hashedPass) {
      return res
        .status(400)
        .json({ success: false, msg: "Failed to register!" });
    }

    /* if (role) {
            if (role === "admin") {
                return res.status(400).json({ success: false, msg: "Admin role is not allowed" });
            }
        } */
    const uniqueId = await generateUniqueUserId();
    const user = new User({
      name,
      email,
      mobile,
      password: hashedPass,
      role,
      address,
      uniqueId,
      referCode: generateReferralCode(6),
    });

    if (image) {
      let imageUrl = await uploadToCloudinary(image.tempFilePath);
      user.image = imageUrl;
    }
    const result = await user.save();
    // let result = "ok"
    if (result) {
      const token = await generateToken(result);
      return res.status(200).json({
        success: true,
        msg: `User registered successfully`,
        result,
        token,
      });
    }
    return res.status(400).json({
      error: "Failed to register user",
      success: false,
      msg: "Failed to register user",
    });
  } catch (error) {
    console.log("error on registorUser: ", error);
    return res
      .status(500)
      .json({ error: error, success: false, msg: error.message });
  }
};

exports.loginEmail = async (req, res) => {
  const email = req.body?.email;
  const password = req.body?.password;
  try {
    const checkUser = await User.findOne({ email: email });
    if (!checkUser) {
      return res.status(401).json({
        error: "Invalid credentials",
        success: false,
        msg: "User not found",
      });
    }
    const matchedPass = await bcrypt.compare(password, checkUser.password);
    if (!matchedPass) {
      return res
        .status(401)
        .json({ success: false, msg: "Invalid credentials" });
    }
    const token = await generateToken(checkUser);
    return res
      .status(200)
      .json({ success: true, msg: "User logged in successfully", token });
  } catch (error) {
    console.log("error on loginUser: ", error);
    return res
      .status(500)
      .json({ error: error, success: false, msg: error.message });
  }
};

exports.loginMobile = async (req, res) => {
  const mobile = req.body?.mobile;
  const password = req.body?.password;
  try {
    const checkUser = await User.findOne({ mobile: mobile });
    if (!checkUser) {
      return res.status(401).json({
        error: "Invalid credentials",
        success: false,
        msg: "User not found",
      });
    }
    const matchedPass = await bcrypt.compare(password, checkUser.password);
    if (!matchedPass) {
      return res
        .status(401)
        .json({ success: false, msg: "Invalid credentials" });
    }
    const token = await generateToken(checkUser);
    return res
      .status(200)
      .json({ success: true, msg: "User logged in successfully", token });
  } catch (error) {
    console.log("error on loginUser: ", error);
    return res
      .status(500)
      .json({ error: error, success: false, msg: error.message });
  }
};

exports.requistOtp = async (req, res) => {
  const { mobile, role } = req.body;
  try {
    const checkUser = await User.findOne({ mobile, role });
    if (!checkUser) {
      return res.status(400).json({ success: false, msg: "User not found!" });
    }
    let result = await urlSendTestOtp(mobile);
    if (result) {
      return res
        .status(200)
        .json({ success: true, result, msg: "Otp send successfully 1234" });
    }
  } catch (error) {
    console.log("error on requistOtp: ", error);
    return res
      .status(500)
      .json({ error: error, success: false, msg: error.message });
  }
};

exports.verifyOtp = async (req, res) => {
  let { sessionId, otp, whatsappNumber, role, fcmToken, currentScreen } =
    req.body;
  whatsappNumber = whatsappNumber?.toLowerCase();
  try {
    const checkUser = await User.findOne({ whatsappNumber, role });
    if (!checkUser) {
      return res.status(400).json({ success: false, msg: "User not found!" });
    }
    let result = await urlVerifyOtp(sessionId, otp);
    if (result?.Status == "Success") {
      if (currentScreen) checkUser.currentScreen = currentScreen?.toUpperCase();
      checkUser.isMobileVerified = true;
      checkUser.fcmToken = fcmToken;
      await checkUser.save();
      const token = await generateToken(checkUser);
      return res.status(200).json({
        success: true,
        msg: "Verification successful",
        result,
        user: checkUser,
        token,
      });
    }
    return res.status(400).json({ success: false, msg: "Invalid OTP" });
  } catch (error) {
    console.log("error on verifyOtp: ", error);
    return res
      .status(500)
      .json({ error: error, success: false, msg: error.message });
  }
};

exports.login = async (req, res) => {
  let { role, whatsappNumber, fcmToken } = req.body;
  try {
    role = role || ROLES.USER;
    whatsappNumber = whatsappNumber?.toLowerCase();
    let checkUser = await User.findOne({ whatsappNumber, role });
    let isFirst = false;
    if (role == ROLES.SUB_VENDOR) {
      if (!checkUser) {
        return sendError(
          res,
          400,
          "Sub Vendor not found! Please contact brand's vendor."
        );
      }
    }
    if (!checkUser) {
      isFirst = true;
      checkUser = new User({
        whatsappNumber,
        role,
        uniqueId: await generateUniqueUserId(),
        referCode: generateReferralCode(6),
        fcmToken: fcmToken ? fcmToken : null,
      });
    }
    await checkUser.save();
    let result = await urlSendTestOtp(whatsappNumber);
    return res.status(200).json({
      success: true,
      msg: "OTP sent to your mobile number successfully.",
      isFirst,
      result,
      user: checkUser,
    });
  } catch (error) {
    console.log("error on login: ", error);
    return res
      .status(500)
      .json({ error: error, success: false, msg: error.message });
  }
};

exports.userProfileComplete = async (req, res) => {
  // console.log("req.boydy: ", req.body);

  const id = req.payload?._id;
  const name = req.body?.name;
  const email = req.body?.email;
  const address = req.body?.address;
  const dob = req.body?.dob;
  const applyReferalCode = req.body?.referCode;
  const lat = req.body?.lat;
  const lng = req.body?.lng;
  const city = req.body?.city;
  const state = req.body?.state;
  const country = req.body?.country;
  const postalCode = req.body?.postalCode;
  const formattedAddress = req.body?.formattedAddress;
  const street = req.body?.street;
  const landMark = req.body?.landMark;

  try {
    const checkUser = await User.findById(id);
    if (!checkUser) {
      return res.status(400).json({ success: false, msg: "User not found!" });
    }
    let checkLocation = await Location.findOne({ user: id });
    if (!checkLocation) {
      const location = new Location({
        user: id,
        name,
        address,
        location: {
          type: "Point",
          coordinates: [lng, lat], // Order: [longitude, latitude]
        },
        city,
        state,
        country,
        postalCode,
        formattedAddress,
        street,
        landMark,
      });
      checkUser.location = location._id;
      await location.save();
    } else {
      checkLocation = new Location({
        user: id,
        name,
        address,
        location: {
          type: "Point",
          coordinates: [lng, lat], // Order: [longitude, latitude]
        },
        city,
        state,
        country,
        postalCode,
        formattedAddress,
        street,
        landMark,
      });
      checkUser.location = checkLocation._id;

      await checkLocation.save();
    }

    if (name) checkUser.name = name;
    if (email) checkUser.email = email;
    if (address) checkUser.address = address;
    if (dob) checkUser.dob = dob;

    if (req.body?.isFirst) {
      if (applyReferalCode) checkUser.applyReferalCode = applyReferalCode;
    }

    await checkUser.save();
    return res.status(200).json({
      success: true,
      msg: "Profile updated successfully",
      result: checkUser,
    });
  } catch (error) {
    console.log("error on userProfileComplete: ", error);
    return res
      .status(500)
      .json({ error: error, success: false, msg: error.message });
  }
};

exports.verifyVendorMobileNumber = async (req, res) => {
  const mobile = req.body?.mobile;

  try {
    const checkVendor = await User.findOne({ mobile });
    if (checkVendor) {
      return res
        .status(400)
        .json({ msg: "Mobile number already exists!", success: false });
    }
    const result = await User.create({
      mobile,
      role: "vendor",
    });
    if (result) {
      return res
        .status(200)
        .json({ msg: "OTP sent to your whatsapp.", success: true });
    }
    return res
      .status(400)
      .json({ msg: "Failed to verify mobile number!", success: false });
  } catch (error) {
    console.log("error on verifyVendorMobileNumber: ", error);
    return res
      .status(500)
      .json({ error: error, success: false, msg: error.message });
  }
};

exports.verifyOTPVendorMobile = async (req, res) => {
  const mobile = req.body?.mobile;
  const otp = req.body?.otp;
  try {
    const checkUser = await User.findOne({ mobile });
    if (!checkUser) {
      return res.status({
        msg: "No register mobile number found!",
        success: false,
      });
    }
    if (otp == "123456") {
      checkUser.isMobileVerify = true;
      await checkUser.save();
      return res
        .status(200)
        .json({ msg: "Your OTP verify successfully.", success: true });
    }
    return res
      .status(400)
      .json({ msg: "Faild to verify OTP.", success: false });
  } catch (error) {
    console.log("error on verifyOTPVendorMobile: ", error);
    return res
      .status(500)
      .json({ error: error, success: false, msg: error.message });
  }
};
