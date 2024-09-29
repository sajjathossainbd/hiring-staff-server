// controllers/jobsController.js

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

exports.getAllJobs = async (req, res) => {
  const result = await jobsCollection.find().toArray();
  // console.log(result);
  res.send(result);
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
