const Brand = require("../model/Brand");
const Gst = require("../model/Gst");
const Location = require("../model/Location");
const User = require("../model/User");
const WorkHours = require("../model/WorkHours");
const { uploadToCloudinary } = require("../service/uploadImage");
const bcrypt = require("bcryptjs");
const { generateReferralCode } = require("../utils");
let salt = 10;

exports.getAllBrand = async (req, res) => {
  const id = req.params?.id;
  try {
    if (id) {
      const result = await Brand.findById(id)
        .populate("location")
        .populate("gst")
        .populate("workHours");
      if (result) {
        return res
          .status(200)
          .json({ success: true, msg: "Brand details", result });
      }
      return res.status(404).json({ msg: "Brand not found", success: false });
    }
    const result = await Brand.find()
      .sort({ createdAt: -1 })
      .populate("location")
      .populate("gst")
      .populate("workHours");
    if (result) {
      return res
        .status(200)
        .json({ success: true, msg: "Brand details", result });
    }
    return res.status(404).json({ msg: "Brand not found", success: false });
  } catch (error) {
    console.log("error on getAllBrand: ", error);
    return res
      .status(500)
      .json({ error: error, success: false, msg: error.message });
  }
};

exports.pagination = async (req, res) => {
  const page = parseInt(req?.query?.page);
  const limit = parseInt(req?.query?.limit);
  const skip = (page - 1) * limit;
  try {
    const result = await Brand.find()
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 })
      .populate("location")
      .populate("gst")
      .populate("workHours");
    const totalDocuments = await Brand.countDocuments();
    const totalPages = Math.ceil(totalDocuments / limit);

    if (result) {
      return res.status(200).json({
        success: true,
        msg: "Brand details",
        result,
        pagination: { totalDocuments, totalPages, currentPage: page, limit },
      });
    }
    return res.status(404).json({ msg: "Brand not found", success: false });
  } catch (error) {
    console.log("error on getAllBrand: ", error);
    return res
      .status(500)
      .json({ error: error, success: false, msg: error.message });
  }
};

exports.addBrand = async (req, res) => {
  const name = req.body?.name;
  const slogan = req.body?.slogan;
  const email = req.body?.email;
  const mobile = req.body?.mobile;
  const whatsappNumber = req.body?.whatsappNumber;
  const category = req.body?.category;
  const subCategory = req.body?.subCategory;
  const description = req.body?.description;
  // location
  const address = req.body?.address;
  const state = req.body?.state;
  const city = req.body?.city;
  const zipCode = req.body?.zipCode;
  // gst
  const companyName = req.body?.companyName;
  const gstNumber = req.body?.gstNumber;
  //const zipCode = req.body?.zipCode;

  const marketPermission = req.body?.marketPermission;
  const isActive = req.body?.isActive;

  const loginEmail = req.body?.loginEmail;
  const password = req.body?.password;

  const monday =
    typeof req.body?.monday == "string"
      ? JSON.parse(req.body?.monday)
      : req.body?.monday;
  const tuesday =
    typeof req.body?.tuesday == "string"
      ? JSON.parse(req.body?.tuesday)
      : req.body?.tuesday;
  const wednesday =
    typeof req.body?.wednesday == "string"
      ? JSON.parse(req.body?.wednesday)
      : req.body?.wednesday;
  const thursday =
    typeof req.body?.thursday == "bigint"
      ? JSON.parse(req.body?.thursday)
      : req.body?.thursday;
  const friday =
    typeof req.body?.friday == "string"
      ? JSON.parse(req.body?.friday)
      : req.body?.friday;
  const saturday =
    typeof req.body?.saturday == "string"
      ? JSON.parse(req.body?.saturday)
      : req.body?.saturday;
  const sunday =
    typeof req.body?.sunday == "string"
      ? JSON.parse(req.body?.sunday)
      : req.body?.sunday;

  const logo = req.files?.logo;
  const cover = req.files?.cover;

  try {
    const checkBrand = await Brand.findOne({ name: name });
    if (checkBrand) {
      return res
        .status(400)
        .json({ success: false, msg: "Brand already exists" });
    }

    const brand = new Brand({
      name,
      slogan,
      email,
      mobile,
      whatsappNumber,
      category,
      subCategory,
      description,
      marketPermission,
      isActive,
    });

    if (logo) {
      let imageUrl = await uploadToCloudinary(logo.tempFilePath);
      brand.logo = imageUrl;
    }
    if (cover) {
      let imageUrl = await uploadToCloudinary(cover.tempFilePath);
      brand.cover = imageUrl;
    }

    const referCode = generateReferralCode(6);
    const hashedPass = await bcrypt.hash(password, parseInt(salt));
    const user = new User({
      email: loginEmail,
      password: hashedPass,
      referCode,
    });

    const location = new Location({
      user: user._id,
      address,
      state,
      city,
      zipCode,
      brand: brand._id,
      location: {
        type: "Point",
        coordinates: [parseFloat(0), parseFloat(0)], // <-- REQUIRED!
      },
      /* location: {
                type: 'Point',
                coordinates: [lng, lat] // Order: [longitude, latitude]
            } */
    });
    if (location) {
      brand.location = location._id;
      await location.save();
    }

    const checkGst = await Gst.findOne({ gstNumber: gstNumber });
    if (!checkGst) {
      const gst = new Gst({
        companyName,
        gstNumber,
        zipCode,
        brand: brand._id,
        user: user?._id,
      });
      await gst.save();
      user.gst = gst._id;
      brand.gst = gst._id;
    }

    const checkLogin = await User.findOne({
      email: loginEmail,
      brand: brand._id,
      role: "vendor",
    });
    if (checkLogin) {
      return res
        .status(400)
        .json({ success: false, msg: "User already exists" });
    }

    brand.user = user._id;

    const workingHours = new WorkHours({
      monday,
      tuesday,
      wednesday,
      thursday,
      friday,
      saturday,
      sunday,
      brand: brand._id,
      user: user._id,
    });
    if (workingHours) {
      brand.workHours = workingHours._id;
      workingHours.user = user._id;
      workingHours.brand = brand._id;
      await workingHours.save();
    }

    user.workHour = workingHours._id;

    await user.save();
    const result = await brand.save();
    if (result) {
      return res
        .status(200)
        .json({ success: true, msg: "Brand added successfully", result });
    }
    return res
      .status(400)
      .json({ msg: "Failed to save brand", success: false });
  } catch (error) {
    console.log("error on addBrand: ", error);
    return res
      .status(500)
      .json({ error: error, success: false, msg: error.message });
  }
};
