// routes/jobsRoutes.js

const express = require("express");
const { postJob, getAllJobs } = require("../controllers/jobsController");

const router = express.Router();

router.post("/", postJob);
router.get("/", getAllJobs);

module.exports = router;
