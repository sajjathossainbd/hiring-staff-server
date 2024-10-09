const express = require("express");
const {
  getAllCandidates,
  getCandidateById,
   getUniqueProfessions,
   getUniqueProfessionsAndCities,
   getCandidatesData,
} = require("../controllers/candidateController");

const router = express.Router();

// GET /candidates
router.get("/", getAllCandidates);

// Route to get unique data
router.get('/unique',getCandidatesData);

// GET/candidate by id
router.get("/:id", getCandidateById);

module.exports = router;
