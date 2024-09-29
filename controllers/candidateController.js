// controllers/candidateController.js

const { client } = require("../config/db");
const candidatesCollection = client.db("hiringStaffDB").collection("candidates");

exports.getAllCandidates = async (req, res) => {
  const result = await candidatesCollection.find().toArray();
  res.send(result);
};
