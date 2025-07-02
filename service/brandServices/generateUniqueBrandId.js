const Brand = require("../../model/Brand");

exports.generateUniqueBrandId = async () => {
  const prefix = "#B";
  // while (true) {
  const randomNumber = Math.floor(100000 + Math.random() * 900000);
  const uniqueId = `${prefix}${randomNumber}`;
  // const existingBrand = await Brand.findOne({ uniqueId });
  // if (!existingBrand) {
  return uniqueId;
  //   }
  // }
};
