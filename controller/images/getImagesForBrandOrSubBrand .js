const Brand = require("../../model/Brand");
const SubBrand = require("../../model/SubBrand");
const Image = require("../../model/Image");
const { sendError, sendSuccess } = require("../../utils");

const VALID_FIELDS = ["gallery", "menu"];

exports.getImagesFromFieldOfEntity = async (req, res) => {
  try {
    const { entityId } = req.params;
    const { fieldType } = req.query;

    if (!entityId || !fieldType) {
      return sendError(res, 400, "entityId and fieldType are required");
    }

    if (!VALID_FIELDS.includes(fieldType)) {
      return sendError(
        res,
        400,
        "Invalid fieldType. Must be 'gallery' or 'menu'"
      );
    }
    let entity = await Brand.findOne({
      _id: entityId,
      isDeleted: false,
    }).lean();
    let entityType = "brand";

    if (!entity) {
      entity = await SubBrand.findOne({
        _id: entityId,
        isDeleted: false,
      }).lean();
      entityType = "subBrand";
    }
    if (!entity) {
      return sendError(res, 404, "No brand or subBrand found with given ID");
    }
    const imageIds = entity[fieldType] || [];
    const images = await Image.find({
      _id: { $in: imageIds },
      isDeleted: false,
    }).sort({ createdAt: -1 });

    return sendSuccess(
      res,
      200,
      `Fetched ${fieldType} images for ${entityType}`,
      { images }
    );
  } catch (error) {
    console.error("Error in getImagesFromFieldOfEntity:", error);
    return sendError(res, 500, error.message);
  }
};
