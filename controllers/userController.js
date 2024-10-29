const { client, ObjectId } = require("../config/db");
const usersCollection = client.db("hiringStaffDB").collection("users");

// function for sending responses
const sendResponse = (res, data, statusCode = 200) => {
  res.status(statusCode).json(data);
};

// get candidates email
exports.candidatesEmail = async (req, res) => {
  try {
    const candidates = await usersCollection
      .find({ role: "candidate", plan: "Premium" })
      .project({ email: 1, _id: 0 })
      .toArray();

    const candidateEmails = candidates
      .map((candidate) => candidate.email)
      .join(",");

    res.status(200).json({
      candidateEmails: [candidateEmails],
    });
  } catch (error) {
    console.error("Error fetching candidate emails:", error);
    res.status(500).json({ message: "Failed to retrieve candidate emails" });
  }
};
