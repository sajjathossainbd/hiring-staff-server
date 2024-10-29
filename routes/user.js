// routes/userRoutes.js

const express = require("express");
const {
  candidatesEmail,
} = require("../controllers/userController");

const router = express.Router();


// get emails for sending email
router.get("/candidate-emails", candidatesEmail);

module.exports = router;
