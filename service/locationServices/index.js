const { createLacation } = require("./addLocation");
const {
  getLocationByUserAndBrandId,
} = require("./getLocationByUserAndBrandId");
const {
  getLocationByBrandAndSubBrandAddress,
} = require("./getLocationByBrandAndSubBrandAddress");
const { updateLocationByFields } = require("./updateLocationByFields");

module.exports = {
  createLacation,
  getLocationByUserAndBrandId,
  getLocationByBrandAndSubBrandAddress,
  updateLocationByFields,
};
