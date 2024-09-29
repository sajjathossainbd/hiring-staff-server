const { client } = require("../config/db");
const jobsCollection = client.db("hiringStaffDB").collection("jobs");

// post job from dashboard
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

// get all jobs from database
exports.getAllJobs = async (req, res) => {
  const result = await jobsCollection.find().toArray();
  // console.log(result);
  res.send(result);
};
