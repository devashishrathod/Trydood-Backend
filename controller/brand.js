//const Brand = require("../model/Brand");
//const { getBrandWithAllDetails } = require("../service/brandServices");

// exports.getAllBrand = async (req, res) => {
//   const brandId = req?.params?.id;
//   try {
//     if (brandId) {
//       const result = await getBrandWithAllDetails(brandId);
//       if (result) {
//         return res
//           .status(200)
//           .json({ success: true, msg: "Brand details", result });
//       }
//       return res.status(404).json({ msg: "Brand not found", success: false });
//     }
//     const result = await Brand.find({ isDeleted: false })
//       .sort({ createdAt: -1 })
//       .populate("user")
//       .populate("category")
//       .populate("subCategory")
//       .populate("location")
//       .populate("gst")
//       .populate("workHours")
//       .populate("bankAccount")
//       .populate("transaction")
//       .populate("subscribed");
//     if (result) {
//       return res
//         .status(200)
//         .json({ success: true, msg: "Brand details", result });
//     }
//     return res.status(404).json({ msg: "Brand not found", success: false });
//   } catch (error) {
//     console.log("error on getAllBrand: ", error);
//     return res
//       .status(500)
//       .json({ error: error, success: false, msg: error.message });
//   }
// };

const Brand = require("../model/Brand");
const Follow = require("../model/Follow");
const { getBrandWithAllDetails } = require("../service/brandServices");

exports.getAllBrand = async (req, res) => {
  const brandId = req?.params?.id;
  const userId = req?.payload?._id;
  try {
    if (brandId) {
      const result = await getBrandWithAllDetails(brandId);
      if (result) {
        let isFollowed = false;
        if (userId) {
          const follow = await Follow.findOne({
            follower: userId,
            followee: brandId,
            isDeleted: false,
          });
          isFollowed = !!follow;
        }
        return res.status(200).json({
          success: true,
          msg: "Brand details",
          result: { ...result.toObject(), isFollowed },
        });
      }
      return res.status(404).json({ msg: "Brand not found", success: false });
    }
    let result = await Brand.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .populate("user")
      .populate("category")
      .populate("subCategory")
      .populate("location")
      .populate("gst")
      .populate("workHours")
      .populate("bankAccount")
      .populate("transaction")
      .populate("subscribed");
    if (result) {
      if (userId) {
        const followedBrands = await Follow.find({
          follower: userId,
          isDeleted: false,
        }).distinct("followee");
        result = result.map((brand) => {
          const obj = brand.toObject();
          obj.isFollowed = followedBrands.includes(String(brand._id));
          return obj;
        });
      } else {
        result = result.map((brand) => ({
          ...brand.toObject(),
          isFollowed: false,
        }));
      }
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
      .populate("workHours")
      .populate("user")
      .populate("category")
      .populate("subCategory")
      .populate("bankAccount")
      .populate("transaction")
      .populate("subscribed");
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
