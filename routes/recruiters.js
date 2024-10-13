const express = require("express");
const { getAllRecruiters, getRecruiterById, getRecruitersData } = require("../controllers/recruitersController");

const router = express.Router();

// GET all recruiters
router.get("/", getAllRecruiters);
//unique data
router.get("/unique",getRecruitersData)
// GET recruiter by id
router.get('/:id',getRecruiterById)

module.exports = router;
