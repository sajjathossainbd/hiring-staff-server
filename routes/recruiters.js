// routes/recruiterRoutes.js

const express = require("express");
const { getAllRecruiters } = require("../controllers/recruitersController");

const router = express.Router();

router.get("/", getAllRecruiters);

module.exports = router;
