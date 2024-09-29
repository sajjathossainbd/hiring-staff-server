// routes/jobsRoutes.js

const express = require("express");
const {
  postJob,
  getAllJobs,
  getJob,
} = require("../controllers/jobsController");

const router = express.Router();

router.post("/", postJob);
router.get("/", getAllJobs);
router.get("/:id", getJob);

module.exports = router;
