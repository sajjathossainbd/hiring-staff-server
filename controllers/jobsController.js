const { ObjectId } = require("mongodb");
const { client } = require("../config/db");
const jobsCollection = client.db("hiringStaffDB").collection("jobs");

exports.postJob = async (req, res) => {
  const jobData = req.body;
  const query = { jobTitle: jobData.jobTitle };
  const existingJob = await jobsCollection.findOne(query);

  if (existingJob) {
    return res.status(409).send({
      message: "Job Already Exists",
      insertId: null,
    });
  } else {
    const result = await jobsCollection.insertOne(jobData);
    res.send(result);
  }
};

// Get all jobs and filter by category
exports.getAllJobs = async (req, res) => {
  try {
    const { category } = req.query;
    const query = category ? { category } : {};

    const result = await jobsCollection.find(query).toArray();
    res.send(result);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).send({ message: "Error fetching jobs" });
  }
};

// Get single job
exports.getJob = async (req, res) => {
  try {
    const jobId = req.params.id;

    // Validate if jobId is a valid ObjectId
    if (!ObjectId.isValid(jobId)) {
      return res.status(400).send({ message: "Invalid Job ID" });
    }

    // Fetch the job from the database
    const result = await jobsCollection.findOne({ _id: new ObjectId(jobId) });

    if (!result) {
      return res.status(404).send({ message: "Job not found" });
    }

    res.send(result);
  } catch (error) {
    console.error("Error fetching job:", error);
    res.status(500).send({ message: "Server error" });
  }
};

// GET jobs by recruiter email
exports.getJobsByEmail = async (req, res) => {
  const email = req.params.email;
  const query = {
    email: email,
  };
  const result = await jobsCollection.find(query).toArray();
  res.send(result);
};
