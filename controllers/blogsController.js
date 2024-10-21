const { client, ObjectId } = require("../config/db");
const blogsCollection = client.db("hiringStaffDB").collection("blogs");

// function for sending responses
const sendResponse = (res, data, statusCode = 200) => {
  res.status(statusCode).json(data);
};

// Get all Blogs with pagination
exports.searchAndFilterBlogs = async (req, res) => {
  const { page = 1, limit = 3, query = "" } = req.query;
  const skip = (page - 1) * limit;
  const searchQuery = query.trim().toLowerCase();

  const filter = searchQuery
    ? {
      $or: [
        { title: { $regex: searchQuery, $options: "i" } },
        { tags: { $regex: searchQuery, $options: "i" } },
        { author: { $regex: searchQuery, $options: "i" } },
        { date_published: { $regex: searchQuery, $options: "i" } },
      ],
    }
    : {};

  try {
    const blogs = await blogsCollection.find(filter).skip(skip).limit(parseInt(limit)).toArray();
    const totalBlogs = await blogsCollection.countDocuments(filter);
    const totalPages = Math.ceil(totalBlogs / limit);

    sendResponse(res, {
      blogs,
      currentPage: parseInt(page),
      totalPages,
      totalBlogs,
    });
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

// GET ALL blog
exports.getAllBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10; // Default limit to 10 if not specified
    const skip = (page - 1) * limit;

    // Assuming 'blogsCollection' is your MongoDB collection for blogs
    const blogs = await blogsCollection
      .find()
      .skip(skip)
      .limit(limit)
      .toArray();

    const totalDocuments = await blogsCollection.countDocuments();
    const totalPages = Math.ceil(totalDocuments / limit);

    sendResponse(res, {
      blogs,
      currentPage: page,
      totalPages,
      totalDocuments,
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    sendResponse(res, { error: "Failed to retrieve blog list" }, 500);
  }
};
