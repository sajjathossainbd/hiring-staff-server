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
  updateAppliedJobStatus,
  getAppliedJobsByEmailAndShortlist,
  updateJobSelectedStatus,
  getApprovedShortlistedJobs,
  getSelectedJobs,
  getAppliedJobByShortlist,
  getApplicationsByJobId,
  getAppliedJobsByIdWithoutPagination,
  assignAssessment,
  submitAssignment,
  toggleInterviewStatus,
  assignInvitation,
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

// get applied jobs for recruiter dashboard
router.get("/applied/applications/:jobId", getApplicationsByJobId);

// delete jobs
router.delete("/delete/:id", deleteJob);

// applyJob
router.post("/applied-jobs", appliedJobApplication);

// get apliedJobs
router.get("/get/applied-jobs", getAllAppliedJobs);

// get apliedJobs for singele candidate
router.get("/applied-jobs/:id", getAppliedJobsById);

router.get("/applied-jobs/validate/:id", getAppliedJobsByIdWithoutPagination);

// get applied jobs by email
router.get("/applied-jobs/email/:email", getAppliedJobsByEmail);

// delete applied job
router.delete("/applied-jobs/delete/:id", deleteAppliedJob);


// update applied jobs
router.patch("/applied-jobs/update/:id", updateAppliedJobStatus);

// Get applied jobs by email and shortlisted jobs
router.get("/applied-jobs/email/shortlist/:email", getAppliedJobsByEmailAndShortlist);


// update applied jobs select status
router.patch("/applied-jobs/selected/:id", updateJobSelectedStatus);

// get approved shortlisted by email for candidate
router.get("/applied-jobs/shortlist/approved/:email", getApprovedShortlistedJobs);

// get  shortlisted jobs
router.get("/applied-jobs/shortlist/approved", getAppliedJobByShortlist);

// get selected jobs by email for candidate
router.get("/applied-jobs/selected/:email", getSelectedJobs);

// assign assesssment
router.patch("/applied-jobs/assign-assessment/:id", assignAssessment);

// submit assignment
router.patch("/applied-jobs/submit-assessment/:id", submitAssignment);

// Toggle Interview Status
router.patch("/applied-jobs/interview/:id", toggleInterviewStatus);

// assign interview
router.patch("/interview-schedule/assign/:id", assignInvitation);

module.exports = router;
