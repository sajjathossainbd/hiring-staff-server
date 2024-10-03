const { ObjectId } = require("mongodb");
const { client } = require("../config/db");
const jobsCollection = client.db("hiringStaffDB").collection("jobs");

// function for sending responses
const sendResponse = (res, data, statusCode = 200) => {
  res.status(statusCode).json(data);
};

// Post a job
exports.postJob = async (req, res) => {
  try {
    const jobData = req.body;
    const query = { jobTitle: jobData.jobTitle };
    const existingJob = await jobsCollection.findOne(query);

    if (existingJob) {
      return sendResponse(
        res,
        { message: "Job Already Exists", insertId: null },
        409
      );
    }

    const result = await jobsCollection.insertOne(jobData);
    sendResponse(res, {
      message: "Job posted successfully",
      insertId: result.insertedId,
    });
  } catch (error) {
    console.error("Error posting job:", error);
    sendResponse(res, { message: "Failed to post job" }, 500);
  }
};

// Get all jobs and filter by category
exports.getAllJobs = async (req, res) => {
  try {
    const { job_category, job_title } = req.query;
    const query = {};

    if (job_category) {
      query.job_category = job_category;
    }

    if (job_title) {
      query.job_title = { $regex: job_title, $options: "i" };
    }

    const result = await jobsCollection.find(query).toArray();
    sendResponse(res, result);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    sendResponse(res, { message: "Error fetching jobs" }, 500);
  }
};

// Get a single job
exports.getJob = async (req, res) => {
  try {
    const jobId = req.params.id;

    if (!ObjectId.isValid(jobId)) {
      return sendResponse(res, { message: "Invalid Job ID" }, 400);
    }

    const result = await jobsCollection.findOne({ _id: new ObjectId(jobId) });

    if (!result) {
      return sendResponse(res, { message: "Job not found" }, 404);
    }

    sendResponse(res, result);
  } catch (error) {
    console.error("Error fetching job:", error);
    sendResponse(res, { message: "Server error" }, 500);
  }
};

// Get jobs by recruiter email
exports.getJobsByEmail = async (req, res) => {
  try {
    const email = req.params.email;
    const query = { email: email };
    const result = await jobsCollection.find(query).toArray();

    if (result.length === 0) {
      return sendResponse(
        res,
        { message: "No jobs found for this email" },
        404
      );
    }

    sendResponse(res, result);
  } catch (error) {
    console.error("Error fetching jobs by email:", error);
    sendResponse(res, { message: "Error fetching jobs" }, 500);
  }
};
