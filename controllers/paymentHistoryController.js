const { client } = require("../config/db");
const paymentCollection = client
  .db("hiringStaffDB")
  .collection("paymentHistory");
const usersCollection = client.db("hiringStaffDB").collection("users");

// POST: Add a new payment history and update user's plan
const paymentHistory = async (req, res) => {
  try {
    const { email, category, ...paymentDetails } = req.body;

    // Check if the user already has a plan in the same category
    const existingPayment = await paymentCollection.findOne({
      email,
      category,
    });
    if (existingPayment) {
      return res
        .status(400)
        .send({ error: "You already have a plan in this category." });
    }

    // Insert the payment details into the payment history collection
    const result = await paymentCollection.insertOne({
      email,
      category,
      ...paymentDetails,
    });

    // Update the user's plan in the users collection
    await usersCollection.updateOne({ email }, { $set: { plan: category } });

    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ error: "Failed to process payment." });
  }
};

// GET: Retrieve all payment history records
const getPaymentHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 5; // Default to 5 items per page
    const skip = (page - 1) * limit;

    // Fetch payment history with pagination
    const payments = await paymentCollection
      .find()
      .skip(skip)
      .limit(limit)
      .toArray();

    // Total document count
    const totalDocuments = await paymentCollection.countDocuments(); // Use paymentCollection here
    const totalPages = Math.ceil(totalDocuments / limit);

    // Return the response with the correct variable
    res.status(200).json({
      payments,
      currentPage: page,
      totalPages,
      totalDocuments,
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).send({ error: "Failed to retrieve payment history" });
  }
};

// Export the functions
module.exports = { paymentHistory, getPaymentHistory };
