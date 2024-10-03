const { client, ObjectId } = require("../config/db");
const recruitersCollection = client
  .db("hiringStaffDB")
  .collection("recruiters");

// function for sending responses
const sendResponse = (res, data, statusCode = 200) => {
  res.status(statusCode).json(data);
};

// Get all recruiters - Search by jobTitle and category
exports.getAllRecruiters = async (req, res) => {
  const { jobTitle, category } = req.query;

  const query = {};

  if (jobTitle || category) {
    const jobPostingsQuery = [];

    if (jobTitle) {
      jobPostingsQuery.push({
        "jobPostings.jobTitle": { $regex: jobTitle, $options: "i" },
      });
    }

    if (category) {
      jobPostingsQuery.push({
        "jobPostings.category": { $regex: category, $options: "i" },
      });
    }

    query.jobPostings = { $or: jobPostingsQuery };
  }

  try {
    const result = await recruitersCollection.find(query).toArray();
    sendResponse(res, result);
  } catch (error) {
    console.error("Error fetching recruiters: ", error);
    sendResponse(
      res,
      { message: "An error occurred while fetching recruiters.", error },
      500
    );
  }
};

// Get a specific recruiter by ID
exports.getRecruiterById = async (req, res) => {
  const recruiterId = req.params.id;

  // Validate the ObjectId
  if (!ObjectId.isValid(recruiterId)) {
    return sendResponse(res, { message: "Invalid Recruiter ID." }, 400);
  }

  try {
    const result = await recruitersCollection.findOne({
      _id: new ObjectId(recruiterId),
    });

    if (!result) {
      return sendResponse(res, { message: "Recruiter not found." }, 404);
    }

    sendResponse(res, result);
  } catch (error) {
    console.error("Error fetching recruiter by ID: ", error);
    sendResponse(res, { message: "An error occurred." }, 500);
  }
};
