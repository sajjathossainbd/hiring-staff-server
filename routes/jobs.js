const express = require("express");
const {
  postJob,
  getJob,
  getJobsByEmail,
  getUniqueCategories,
  deleteJob,
  getUniqueLocation,
  getAllJobsWithFilter,
} = require("../controllers/jobsController");

const router = express.Router();

// post a job
router.post("/", postJob);

// get all jobs
router.get("/categories", getUniqueCategories);
router.get("/job_location", getUniqueLocation);
router.get("/email/:email", getJobsByEmail);
router.get("/", getAllJobsWithFilter);
router.get("/:id", getJob);

// get all job categories
router.get("/categories", getUniqueCategories);

// get jobs by email
router.get("/email/:email", getJobsByEmail);

// delete jobs
router.delete("/delete/:id", deleteJob);

module.exports = router;
