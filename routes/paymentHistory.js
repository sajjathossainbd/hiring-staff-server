// routes/paymentHistory.js

const express = require("express");
// Make sure the path is correct and points to your `controllers/paymentHistoryController.js` file
const { paymentHistory } = require("../controllers/paymentHistoryController");

const router = express.Router();

// Use the imported function in the router
router.post("/", paymentHistory);

module.exports = router;
