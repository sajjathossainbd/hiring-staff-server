// controllers/paymentHistoryController.js

const { client } = require("../config/db");
const paymentCollection = client.db("hiringStaffDB").collection("paymentHistory");

// Make sure the function is named and exported correctly
const paymentHistory = async (req, res) => {
  try {
    const paymentDetails = req.body;
    const result = await paymentCollection.insertOne(paymentDetails);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ error: "Failed to add payment history" });
  }
};

// Export the function
module.exports = { paymentHistory };
