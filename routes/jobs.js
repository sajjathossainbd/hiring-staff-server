// routes/jobsRoutes.js

const express = require("express");
const {
  postJob,
  getAllJobs,
  getJob,
  getJobsByEmail,
} = require("../controllers/jobsController");

const router = express.Router();

// post a job
router.post("/", postJob);

// get all jobs
router.get("/", getAllJobs);
router.get("/:id", getJob);

// get jobs by email
router.get("/:email", getJobsByEmail);

module.exports = router;
