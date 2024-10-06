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
router.get("/categories", getUniqueCategories);
router.get("/email/:email", getJobsByEmail);
router.get("/", getAllJobs);
router.get("/:id", getJob);

module.exports = router;
