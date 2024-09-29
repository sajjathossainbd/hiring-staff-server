// controllers/recruitersController.js

const { client } = require("../config/db");
const recruitersCollection = client.db("hiringStaffDB").collection("recruiters");

exports.getAllRecruiters = async (req, res) => {
  const result = await recruitersCollection.find().toArray();
  res.send(result);
};
