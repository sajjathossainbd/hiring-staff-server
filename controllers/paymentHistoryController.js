const { client } = require("../config/db");
const paymentCollection = client.db("hiringStaffDB").collection("paymentHistory");
const usersCollection = client.db("hiringStaffDB").collection("users");

// POST: Add a new payment history and update user's plan
const paymentHistory = async (req, res) => {
    try {
        const { email, category, ...paymentDetails } = req.body;

        // Check if the user already has a plan in the same category
        const existingPayment = await paymentCollection.findOne({ email, category });
        if (existingPayment) {
            return res.status(400).send({ error: "You already have a plan in this category." });
        }

        // Insert the payment details into the payment history collection
        const result = await paymentCollection.insertOne({ email, category, ...paymentDetails });

        // Update the user's plan in the users collection
        await usersCollection.updateOne(
            { email },
            { $set: { plan: category } }
        );

        res.status(200).send(result);
    } catch (error) {
        res.status(500).send({ error: "Failed to process payment." });
    }
};

// GET: Retrieve all payment history records
const getPaymentHistory = async (req, res) => {
    try {
        const payments = await paymentCollection.find({}).toArray();
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).send({ error: "Failed to retrieve payment history" });
    }
};

// Export the functions
module.exports = { paymentHistory, getPaymentHistory };
