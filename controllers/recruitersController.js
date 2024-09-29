// controllers/recruitersController.js

const { client, ObjectId } = require("../config/db");
const recruitersCollection = client
  .db("hiringStaffDB")
  .collection("recruiters");

// GET all recruiters
exports.getAllRecruiters = async (req, res) => {
  const result = await recruitersCollection.find().toArray();
  res.send(result);
};

// GET a specific recruiter by ID
exports.getRecruiterById = async (req, res) => {
  const recruiterId = req.params.id;
  const result = await recruitersCollection.findOne({
    _id: new ObjectId(recruiterId),
  });
  res.send(result);
};
