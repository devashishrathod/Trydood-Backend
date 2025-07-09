const express = require("express");
const router = express.Router();

const { createOrder } = require("../controller/transactions");

router.post("/create-order", createOrder);

module.exports = router;
