// routes/recruiterRoutes.js

const express = require("express");
const { getAllRecruiters, getRecruiterById } = require("../controllers/recruitersController");

const router = express.Router();

// GET all recruiters
router.get("/", getAllRecruiters);

// GET recruiter by id
router.get('/:id',getRecruiterById)

module.exports = router;
