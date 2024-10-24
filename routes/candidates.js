const express = require("express");
const {
  getAllCandidates,
  getCandidateById,
   getUniqueProfessions,
   getUniqueProfessionsAndCities,
   getCandidatesData,
   addCandidate,
   deleteCandidate,
} = require("../controllers/candidateController");

const router = express.Router();

// Add Candidate
router.post("/candidates", addCandidate);

// GET /candidates
router.get("/", getAllCandidates);

// Route to get unique data
router.get('/unique',getCandidatesData);

// GET/candidate by id
router.get("/:id", getCandidateById);

// delete candidate
router.delete("/delete/:id", deleteCandidate);

module.exports = router;
