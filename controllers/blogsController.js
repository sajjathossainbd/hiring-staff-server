const { client, ObjectId } = require("../config/db");
const blogsCollection = client.db("hiringStaffDB").collection("blogs");

// function for sending responses
const sendResponse = (res, data, statusCode = 200) => {
  res.status(statusCode).json(data);
};

// Get all Blogs with pagination
exports.getAllBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 5;
    const skip = (page - 1) * limit;

    const blogs = await blogsCollection
      .find()
      .skip(skip)
      .limit(limit)
      .toArray();
    const totalBlogs = await blogsCollection.countDocuments();
    const totalPages = Math.ceil(totalBlogs / limit);

    sendResponse(res, {
      blogs,
      currentPage: page,
      totalPages,
      totalBlogs,
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    sendResponse(res, { message: "Failed to fetch blogs" }, 500);
  }
};

// search or filter from blog
exports.searchAndFilterBlogs = async (req, res) => {
  const { title, tags } = req.query;
  const query = {};

  if (title) {
    query.title = { $regex: title, $options: "i" };
  }

  if (tags) {
    query.tags = { $in: tags.split(",") };
  }

  try {
    const blogs = await blogsCollection.find(query).toArray();
    sendResponse(res, blogs);
  } catch (error) {
    console.error("Error searching or filtering blogs:", error);
    sendResponse(res, { message: "Failed to search or filter blogs" }, 500);
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
