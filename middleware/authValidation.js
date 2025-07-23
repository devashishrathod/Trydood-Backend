const jwt = require("jsonwebtoken");
require("dotenv").config();
const { getUserById } = require("../service/userServices");

exports.generateToken = async (checkUser) => {
  return jwt.sign(
    {
      _id: checkUser?._id,
      name: checkUser?.name,
      email: checkUser?.email,
      whatsappNumber: checkUser?.whatsappNumber,
      address: checkUser?.address,
      role: checkUser?.role,
    },
    process.env.SECRET_KEY,
    { expiresIn: "7d" }
  );
};

exports.verifyToken = async (req, res, next) => {
  let token = req.headers["authorization"];
  try {
    if (!token) {
      return res.status(401).json({ msg: "Access Denied!", success: false });
    }
    let splitToken = token.split(" ")[1];
    if (!splitToken) {
      return res.status(401).json({ msg: "Access Denied!", success: false });
    }
    const decodedToken = jwt.verify(splitToken, process.env.SECRET_KEY);
    if (!decodedToken) {
      return res.status(401).json({ msg: "Access Denied!", success: false });
    }
    const checkUser = await getUserById(decodedToken?._id);
    if (checkUser) {
      req.payload = checkUser;
      next();
    } else {
      return res.status(401).json({ msg: "Access Denied!", success: false });
    }
  } catch (error) {
    console.log("error on auth: ", error);
    return res.status(500).json({ err: error.message, error, success: false });
  }
};

exports.checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    const user = req.payload;
    if (!user || !allowedRoles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        message:
          "Forbidden: You do not have permission to perform this action.",
      });
    }
    next();
  };
};
