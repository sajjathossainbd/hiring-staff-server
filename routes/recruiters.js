const express = require("express");
const { getAllRecruiters, getRecruiterById, addRecruiter } = require("../controllers/recruitersController");

const router = express.Router();

// POST /recruiters
router.post("/", addRecruiter);

// GET all recruiters
router.get("/", getAllRecruiters);

// GET recruiter by id
router.get('/:id',getRecruiterById)

module.exports = router;
