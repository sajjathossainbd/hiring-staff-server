const { client, ObjectId } = require("../config/db");
const candidatesCollection = client
  .db("hiringStaffDB")
  .collection("candidates");

// function for sending responses
const sendResponse = (res, data, statusCode = 200) => {
  res.status(statusCode).json(data);
};

// Get all candidates
exports.getAllCandidates = async (req, res) => {
  try {
    const result = await candidatesCollection.find().toArray();
    sendResponse(res, result);
  } catch (error) {
    console.error("Error fetching candidates:", error);
    sendResponse(res, { message: "Failed to fetch candidates" }, 500);
  }
};

// Get candidate by id
exports.getCandidateById = async (req, res) => {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return sendResponse(res, { message: "Invalid candidate ID" }, 400);
  }

  try {
    const result = await candidatesCollection.findOne({
      _id: new ObjectId(id),
    });
    if (!result) {
      return sendResponse(res, { message: "Candidate not found" }, 404);
    }
    sendResponse(res, result);
  } catch (error) {
    console.error("Error fetching candidate by ID:", error);
    sendResponse(res, { message: "Failed to fetch candidate" }, 500);
  }
};
