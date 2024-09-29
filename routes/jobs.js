// routes/jobsRoutes.js

const express = require("express");
const { postJob, getAllJobs, getJobsByRecruiterOrCompany } = require("../controllers/jobsController");

const router = express.Router();

// post a job
router.post("/", postJob);

// get all jobs
router.get("/", getAllJobs);

// get jobs by email or company name 
router.get('/recruiter', getJobsByRecruiterOrCompany)

module.exports = router;
