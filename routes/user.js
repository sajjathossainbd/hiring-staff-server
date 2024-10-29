// routes/userRoutes.js

const express = require("express");
const {
  candidatesEmail,
  getCurrentAdminByEmail,
} = require("../controllers/userController");

const router = express.Router();

router.get("/admin/:email", getCurrentAdminByEmail);

// get emails for sending email
router.get("/candidate-emails", candidatesEmail);

module.exports = router;
