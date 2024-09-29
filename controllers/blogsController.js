const { client } = require("../config/db");
const blogsCollection = client.db("hiringStaffDB").collection("blogs");

// GET all blogs
exports.getAllBlogs = async (req, res) => {
  const result = await blogsCollection.find().toArray();
  res.send(result);
};
