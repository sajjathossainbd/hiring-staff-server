// routes/candidateRoutes.js

const express = require("express");
const { getAllCandidates } = require("../controllers/candidateController");

const router = express.Router();

router.get("/", getAllCandidates);

module.exports = router;
