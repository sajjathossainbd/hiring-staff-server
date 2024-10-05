const express = require("express");
const { paymentHistory, getPaymentHistory, updatePaymentStatus, getPaymentByEmail } = require("../controllers/paymentHistoryController");

const router = express.Router();

router.post("/", paymentHistory);

// get all jobs
router.get("/", getPaymentHistory);

// update payment status
router.patch("/status/:id", updatePaymentStatus);

// get payment by email
router.get("/:email", getPaymentByEmail);

module.exports = router;
