const express = require("express");
const {
  postJob,
  getJob,
  getJobsByEmail,
  getUniqueCategories,
  deleteJob,
  getUniqueLocation,
  getAllJobsWithFilter,

  deleteJobApplication,
  appliedJobApplication,
  getAppliedJobsById,
  deleteAppliedJob,
  getAppliedJobsByEmail,
  getAllAppliedJobs,
} = require("../controllers/jobsController");

const router = express.Router();

// post a job
router.post("/", postJob);

// get all jobs
router.get("/categories", getUniqueCategories);
router.get("/job_location", getUniqueLocation);
router.get("/", getAllJobsWithFilter);
router.get("/:id", getJob);

// get all job categories
router.get("/categories", getUniqueCategories);

// get jobs by email
router.get("/email/:email", getJobsByEmail);

// delete jobs
router.delete("/delete/:id", deleteJob);

// applyJob
router.post("/applied-jobs", appliedJobApplication);

// get apliedJobs
router.get("/get/applied-jobs", getAllAppliedJobs);

// get apliedJobs for singele candidate
router.get("/applied-jobs/:id", getAppliedJobsById);

// get applied jobs by email
router.get("/applied-jobs/email/:email", getAppliedJobsByEmail);

// delete applied job
router.delete("/applied-jobs/delete", deleteAppliedJob);

module.exports = router;
