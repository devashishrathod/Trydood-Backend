const Brand = require("../../model/Brand");
const SubBrand = require("../../model/SubBrand");
const { createImage } = require("../../service/imageServices");
const { sendError, sendSuccess } = require("../../utils");

const FIELD_MAP = ["gallery", "menu"];

exports.createImageForBrandOrSubBrand = async (req, res) => {
  try {
    const { entityId, fieldType, imageUrl, type } = req.body;

    if (!entityId || !fieldType || !imageUrl || !type) {
      return sendError(res, 400, "Missing required fields");
    }
    if (!FIELD_MAP.includes(fieldType)) {
      return sendError(
        res,
        400,
        "Invalid fieldType. Must be 'gallery' or 'menu'"
      );
    }
    let entityType = null;
    let brand = null;
    let user = null;
    let subBrand = null;
    const brandDoc = await Brand.findOne({ _id: entityId, isDeleted: false });
    if (brandDoc) {
      entityType = "brand";
      brand = brandDoc._id;
      user = brandDoc.user;
    }
    if (!brandDoc) {
      const subBrandDoc = await SubBrand.findOne({
        _id: entityId,
        isDeleted: false,
      });
      if (!subBrandDoc) {
        return sendError(res, 404, "No brand or subBrand found with given ID");
      }
      entityType = "subBrand";
      subBrand = subBrandDoc._id;
      brand = subBrandDoc.brand;
      user = subBrandDoc.user;
    }
    const image = await createImage({ user, brand, subBrand, imageUrl, type });
    const Model = entityType === "brand" ? Brand : SubBrand;
    const entity = await Model.findOne({ _id: entityId, isDeleted: false });
    entity[fieldType] = [...new Set([...(entity[fieldType] || []), image._id])];
    await entity.save();
    return sendSuccess(
      res,
      201,
      `Image added to ${entityType}'s ${fieldType} successfully`,
      {
        image,
        [fieldType]: entity[fieldType],
      }
    );
  } catch (error) {
    console.error("Error in createImageForBrandOrSubBrand:", error);
    return sendError(res, 500, error.message);
  }
};
