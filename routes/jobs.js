const express = require("express");
const {
  postJob,
  getJob,
  getJobsByEmail,
  getUniqueCategories,
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

module.exports = router;
