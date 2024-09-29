// routes/jobsRoutes.js

const express = require("express");
const {
  postJob,
  getAllJobs,
  getJobsByEmail,
} = require("../controllers/jobsController");

const router = express.Router();

// post a job
router.post("/", postJob);

// get all jobs
router.get("/", getAllJobs);

// get jobs by email
router.get("/:email", getJobsByEmail);

module.exports = router;
