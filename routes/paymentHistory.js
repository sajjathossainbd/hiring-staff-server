// routes/paymentHistory.js

const express = require("express");
// Make sure the path is correct and points to your `controllers/paymentHistoryController.js` file
const { paymentHistory, getPaymentHistory } = require("../controllers/paymentHistoryController");

const router = express.Router();

// Use the imported function in the router
router.post("/", paymentHistory);

// get all jobs
router.get("/", getPaymentHistory);

module.exports = router;
