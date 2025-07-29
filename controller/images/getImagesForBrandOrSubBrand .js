const Brand = require("../../model/Brand");
const SubBrand = require("../../model/SubBrand");
const Image = require("../../model/Image");
const { sendError, sendSuccess } = require("../../utils");

const VALID_FIELDS = ["gallery", "menu"];

exports.getImagesForBrandOrSubBrand = async (req, res) => {
  try {
    const entityId = req.params?.entityId;
    const { fieldType } = req.query;
    if (!entityId) {
      return sendError(res, 400, "entityId is required");
    }
    if (fieldType && !VALID_FIELDS.includes(fieldType)) {
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
    let isBrand = true;
    if (!entity) {
      entity = await SubBrand.findOne({
        _id: entityId,
        isDeleted: false,
      }).lean();
      entityType = "subBrand";
      isBrand = false;
    }
    if (!entity) {
      return sendError(res, 404, "No brand or subBrand found with given ID");
    }
    const fetchImages = async (ids) => {
      const query = {
        _id: { $in: ids },
        isDeleted: false,
      };
      if (isBrand) {
        query.$or = [{ subBrand: null }, { subBrand: { $exists: false } }];
      }
      return await Image.find(query).sort({ createdAt: -1 });
    };
    let result = {};
    if (fieldType) {
      const ids = entity[fieldType] || [];
      const images = await fetchImages(ids);
      result[fieldType] = images;
    } else {
      const galleryIds = entity.gallery || [];
      const menuIds = entity.menu || [];
      const [gallery, menu] = await Promise.all([
        fetchImages(galleryIds),
        fetchImages(menuIds),
      ]);
      result = { gallery, menu };
    }
    return sendSuccess(res, 200, `Fetched images from ${entityType}`, result);
  } catch (error) {
    console.error("Error in getImagesFromEntity:", error);
    return sendError(res, 500, error.message);
  }
};
