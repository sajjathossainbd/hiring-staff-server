const express = require("express");
const {
  postJob,
  getAllJobs,
  getJob,
  getJobsByEmail,
  getUniqueCategories,
} = require("../controllers/jobsController");

const router = express.Router();

// post a job
router.post("/", postJob);

// get all jobs
router.get("/", getAllJobs);
router.get("/:id", getJob);

// get all job categories
router.get("/categories", getUniqueCategories);

// get jobs by email
router.get("/email/:email", getJobsByEmail);

module.exports = router;
