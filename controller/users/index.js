const { userProfileComplete } = require("../../controller/users/updateUser");
const { logout } = require("./logout");
const { changeLoginMobileNumber } = require("./changeLoginMobileNumber");
const { verifyChangeMobile } = require("./verifyChangeMobile");

module.exports = {
  userProfileComplete,
  logout,
  changeLoginMobileNumber,
  verifyChangeMobile,
};
