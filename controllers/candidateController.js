// controllers/candidateController.js

const { client, ObjectId } = require("../config/db");
const candidatesCollection = client
  .db("hiringStaffDB")
  .collection("candidates");

// get all candidates
exports.getAllCandidates = async (req, res) => {
  const result = await candidatesCollection.find().toArray();
  res.send(result);
};

// get candidate by id
exports.getCandidateById = async (req, res) => {
  const id = req.params.id;
  const result = await candidatesCollection.findOne({ _id: new ObjectId(id) });
  res.send(result);
};
