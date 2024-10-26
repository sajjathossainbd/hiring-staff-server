const express = require("express");
const {
  getAllRecruiters,
  getRecruiterById,
  addRecruiter,
  getRecruitersData,
  getCurrentRecruiter,
  deleteRecruiters,
  getRecruiterOpenJobsById,
} = require("../controllers/recruitersController");

const router = express.Router();

// POST /recruiters
router.post("/", addRecruiter);

// GET current recruiter by emailnodemon 
router.get("/currentRecruiter/:email", getCurrentRecruiter);

// GET all recruiters
router.get("/", getAllRecruiters);

// GET current recruiter by email
router.get("/currentRecruiter/:email", getCurrentRecruiter);

// GET unique data
router.get("/unique", getRecruitersData);

// GET recruiter by id
router.get("/:id", getRecruiterById);


// DELETE recruiter by id
router.delete("/deleteRecruiter/:id", deleteRecruiters);

// GET recruiter Open Jobs by id
router.get("/Openjobs/:id", getRecruiterOpenJobsById);

module.exports = router;
