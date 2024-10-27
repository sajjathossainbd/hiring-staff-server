// routes/userRoutes.js

const express = require("express");
const {
  getCurrentUser,
  updateUserProfile,
  candidatesEmail,
} = require("../controllers/userController");

const router = express.Router();


router.get("/current/:email", getCurrentUser);

// get emails for sending email
router.get("/candidate-emails", candidatesEmail);

module.exports = router;
