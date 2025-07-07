const Brand = require("../../model/Brand");
const { findByIdAndUpdate } = require("../../db/dbServices");

exports.addSubBrandsToBrand = async (brandId, subBrandIds) => {
  const ids = Array.isArray(subBrandIds) ? subBrandIds : [subBrandIds];
  await findByIdAndUpdate(
    Brand,
    brandId,
    { $addToSet: { subBrands: { $each: ids } } } // prevents duplicates
  );
};
