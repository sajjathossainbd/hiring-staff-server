const { client, ObjectId } = require("../config/db");
const blogsCollection = client.db("hiringStaffDB").collection("blogs");

// function for sending responses
const sendResponse = (res, data, statusCode = 200) => {
  res.status(statusCode).json(data);
};

// Get all blogs
exports.getAllBlogs = async (req, res) => {
  
  try {
    const result = await blogsCollection.find().toArray();
    sendResponse(res, result);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    sendResponse(res, { message: "Failed to fetch blogs" }, 500);
  }
};

// Get blog by id
exports.getBlogById = async (req, res) => {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return sendResponse(res, { message: "Invalid Blog ID" }, 400);
  }

  try {
    const result = await blogsCollection.findOne({
      _id: new ObjectId(id),
    });
    if (!result) {
      return sendResponse(res, { message: "blog not found" }, 404);
    }
    sendResponse(res, result);
  } catch (error) {
    console.error("Error fetching blog by ID:", error);
    sendResponse(res, { message: "Failed to fetch blog" }, 500);
  }
};
