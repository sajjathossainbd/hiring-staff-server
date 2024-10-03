const express = require("express");
const { postPayment } = require("../controllers/paymentController");

const router = express.Router();

router.post("/", postPayment);

module.exports = router;
