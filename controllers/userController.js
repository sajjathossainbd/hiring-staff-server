// controllers/userController.js

const { client, ObjectId } = require("../config/db");
const usersCollection = client.db("hiringStaffDB").collection("users");

exports.addUser = async (req, res) => {
  const user = req.body;
  const query = { email: user.email };
  const existingUser = await usersCollection.findOne(query);
  if (existingUser) {
    return res.send({ message: "User Already Exists", insertId: null });
  }
  const result = await usersCollection.insertOne(user);
  res.send(result);
};

exports.getAllUsers = async (req, res) => {
  const result = await usersCollection.find().toArray();
  res.send(result);
};

exports.getCurrentUser = async (req, res) => {
  const email = req.params.email;
  const result = await usersCollection.findOne({ email: email });
  res.send(result);
};

exports.updateUserProfile = async (req, res) => {
  const email = req.params.email;
  const updatedData = req.body;
  const result = await usersCollection.updateOne({ email }, { $set: updatedData });
  res.send({ modifiedCount: result.modifiedCount });
};

exports.deleteUser = async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await usersCollection.deleteOne(query);
  res.send(result);
};

exports.updateUserRole = async (req, res) => {
  const id = req.params.id;
  const { role } = req.body;

  const result = await usersCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { role: role } }
  );

  console.log(`Modified count: ${result.modifiedCount}`);
  res.send({ modifiedCount: result.modifiedCount });
};

