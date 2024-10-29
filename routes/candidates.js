const express = require("express");
const {
  getAllCandidates,
  getCandidateById,
  getCandidatesData,
  addCandidate,
  deleteCandidate,
  getCurrentCandidate,
  updateCandidateProfile,
} = require("../controllers/candidateController");

const router = express.Router();

// Add Candidate
router.post("/", addCandidate);

// GET /candidates
router.get("/", getAllCandidates);

// GET current candidate by email
router.get("/currentCandidate/:email", getCurrentCandidate);

// Route to get unique data
router.get('/unique', getCandidatesData);

// GET/candidate by id
router.get("/:id", getCandidateById);

// delete candidate
router.delete("/delete/:id", deleteCandidate);

// update current candidate
router.patch("/profile/:email", updateCandidateProfile);

module.exports = router;
