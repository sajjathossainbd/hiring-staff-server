const { client, ObjectId } = require("../config/db");
const paymentCollection = client.db("hiringStaffDB").collection("paymentHistory");
const usersCollection = client.db("hiringStaffDB").collection("users");

// Post Add a new payment history 
const paymentHistory = async (req, res) => {
  try {
    const { email, category, ...paymentDetails } = req.body;

    const existingPayment = await paymentCollection.findOne({
      email,
      category,
    });
    if (existingPayment) {
      return res
        .status(400)
        .send({ error: "You already have a plan in this category." });
    }


    const result = await paymentCollection.insertOne({
      email,
      category,
      ...paymentDetails,
    });

    await usersCollection.updateOne({ email }, { $set: { plan: category } });

    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ error: "Failed to process payment." });
  }
};

// Get payment history records
const getPaymentHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;


    const payments = await paymentCollection
      .find()
      .skip(skip)
      .limit(limit)
      .toArray();


    const totalDocuments = await paymentCollection.countDocuments();
    const totalPages = Math.ceil(totalDocuments / limit);


    res.status(200).json({
      payments,
      currentPage: page,
      totalPages,
      totalDocuments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to retrieve payment history" });
  }
};


// Get Retrieve payment history by email
const getPaymentByEmail = async (req, res) => {
  const email = req.params.email;
  const query = {
    email: email,
  };
  const result = await paymentCollection.find(query).toArray();
  res.send(result);
};


// Update payment status
const updatePaymentStatus = async (req, res) => {
  const id = req.params.id;
  const { status } = req.body;

  const result = await paymentCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { status: status } }
  );

  console.log(`Modified count: ${result.modifiedCount}`);
  res.send({ modifiedCount: result.modifiedCount });
};

// Delete payment history
const deletePaymentHistory = async (req, res) => {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return res.status(400).send({ message: "Invalid User ID" });
  }

  try {
    const query = { _id: new ObjectId(id) };
    const result = await paymentCollection.deleteOne(query);

    if (result.deletedCount === 0) {
      return res.status(404).send({ message: "Payment not found" });
    }

    res.send({
      message: "Payment deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting payment:", error);
    res.status(500).send({ message: "Failed to delete payment" });
  }
};


// Export the functions
module.exports = { paymentHistory, getPaymentHistory, updatePaymentStatus, getPaymentByEmail, deletePaymentHistory };
