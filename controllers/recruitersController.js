// controllers/recruitersController.js

const { client, ObjectId } = require("../config/db");
const recruitersCollection = client
  .db("hiringStaffDB")
  .collection("recruiters");

// GET all recruiters
// search by jobTitle and category
exports.getAllRecruiters = async (req, res) => {
  const { jobTitle, category } = req.query;

  const query = {};

  if (jobTitle || category) {
    const jobPostingsQuery = { $or: [] };

    if (jobTitle) {
      jobPostingsQuery.$or.push({
        "jobPostings.jobTitle": {
          $regex: jobTitle,
          $options: "i",
        },
      });
    }

    if (category) {
      jobPostingsQuery.$or.push({
        "jobPostings.category": {
          $regex: category,
          $options: "i",
        },
      });
    }

    query.$or = [jobPostingsQuery];
  }

  try {
    const result = await recruitersCollection.find(query).toArray();

    res.send(result);
  } catch (error) {
    console.error("Error fetching recruiters: ", error);
    res
      .status(500)
      .send({ message: "An error occurred while fetching recruiters.", error });
  }
};

// GET a specific recruiter by ID
exports.getRecruiterById = async (req, res) => {
  const recruiterId = req.params.id;
  const result = await recruitersCollection.findOne({
    _id: new ObjectId(recruiterId),
  });
  res.send(result);
};
