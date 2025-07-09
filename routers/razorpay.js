const express = require("express");
const router = express.Router();

const {
  createOrder,
  verifyTransaction,
} = require("../controller/transactions");

router.post("/create-order", createOrder);
router.put("/verifyPayment", verifyTransaction);

module.exports = router;
