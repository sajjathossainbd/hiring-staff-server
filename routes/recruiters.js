const express = require("express");
const {
  getAllRecruiters,
  getRecruiterById,
  addRecruiter,
  getRecruitersData,
  getCurrentRecruiter,
} = require("../controllers/recruitersController");
const router = express.Router();

// // POST /recruiters
// router.post("/", addRecruiter);

// // GET current recruiter by email
// router.get("/currentRecruiter/:email", getCurrentRecruiter);

// GET all recruiters
router.get("/", getAllRecruiters);

// GET unique data
router.get("/unique", getRecruitersData);

// GET recruiter by id
router.get("/:id", getRecruiterById);

module.exports = router;
