const express = require("express");
const {
  getAllCandidates,
  getCandidateById,
  getCandidatesData,
  addCandidate,
  deleteCandidate,
  getCurrentCandidate,
} = require("../controllers/candidateController");

const router = express.Router();

// Add Candidate
router.post("/candidates", addCandidate);

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

module.exports = router;
