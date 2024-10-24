const express = require("express");
const {
  getAllRecruiters,
  getRecruiterById,
  addRecruiter,
  getRecruitersData,
  getCurrentRecruiter,
  deleteRecruiters,
} = require("../controllers/recruitersController");
const router = express.Router();

// POST /recruiters
router.post("/", addRecruiter);

// GET all recruiters
router.get("/", getAllRecruiters);

// GET current recruiter by email
router.get("/currentRecruiter/:email", getCurrentRecruiter);

// GET recruiter by id
router.get("/:id", getRecruiterById);

// GET unique data
router.get("/unique",  getRecruitersData);

// DELETE recruiter by id
router.delete("/deleteRecruiter/:id", deleteRecruiters);


module.exports = router;
