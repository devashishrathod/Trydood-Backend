const { createEmployee } = require("./createEmployee");
const { generateEmployeeUniqueId } = require("./generateEmployeeUniqueId");
const { deleteEmployeeById } = require("./deleteEmployeeById");
const {
  toggleActiveDeactiveEmployeeById,
} = require("./toggleActiveDeactiveEmployeeById");

module.exports = {
  createEmployee,
  generateEmployeeUniqueId,
  deleteEmployeeById,
  toggleActiveDeactiveEmployeeById,
};
