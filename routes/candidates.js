const express = require("express");
const {
  getAllCandidates,
  getCandidateById,
  searchAndFilterCandidates,
} = require("../controllers/candidateController");

const router = express.Router();

// GET /candidates
router.get("/", getAllCandidates);

// GET/candidate by id
router.get("/:id", getCandidateById);

module.exports = router;