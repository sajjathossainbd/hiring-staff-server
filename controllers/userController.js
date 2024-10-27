const { client, ObjectId } = require("../config/db");
const usersCollection = client.db("hiringStaffDB").collection("users");
const adminsCollection = client.db("hiringStaffDB").collection("admins");

// function for sending responses
const sendResponse = (res, data, statusCode = 200) => {
  res.status(statusCode).json(data);
};


// Get current admin by email

exports.getCurrentAdminByEmail = async (req, res) => {
  try {
    const email = req.params.email;

    if (!email) {
      return sendResponse(res, { message: "Missing email parameter" }, 400);
    }

    const admin = await adminsCollection.findOne({ email: email });

    if (!admin) {
      return sendResponse(res, { message: "Admin not found" }, 404);
    }

    sendResponse(res, admin);
  } catch (error) {
    console.error("Error fetching current admin by email:", error);
    res.status(500).json({ message: "Failed to retrieve current admin" });
  }
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
