const express = require("express");
const router = express.Router();
const { ROLES } = require("../constants");

const {
  getAllSubscription,
  pagination,
  updateSubscription,
  subscribed,
  addSubscription,
  deleteSubscription,
} = require("../controller/subscription");
const { verifyToken, checkRole } = require("../middleware/authValidation");

router.get("/getAll", getAllSubscription);
router.get("/getOne/:id", getAllSubscription);
router.get("/pagination", pagination);
router.post("/add", verifyToken, checkRole(ROLES.ADMIN), addSubscription);
router.put(
  "/update/:id",
  verifyToken,
  checkRole(ROLES.ADMIN),
  updateSubscription
);
router.delete(
  "/delete/:id",
  verifyToken,
  checkRole(ROLES.ADMIN),
  deleteSubscription
);
// ================================ subscribed ===============================
router.post(
  "/subscribed/:id", //id will be of subscription
  verifyToken,
  checkRole(ROLES.VENDOR),
  subscribed
);

module.exports = router;
