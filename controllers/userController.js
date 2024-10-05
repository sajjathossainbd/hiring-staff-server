const { client, ObjectId } = require("../config/db");
const usersCollection = client.db("hiringStaffDB").collection("users");

// function for sending responses
const sendResponse = (res, data, statusCode = 200) => {
  res.status(statusCode).json(data);
};

// Add a new user
exports.addUser = async (req, res) => {
  try {
    const user = req.body;
    const query = { email: user.email };
    const existingUser = await usersCollection.findOne(query);

    if (existingUser) {
      return sendResponse(
        res,
        { message: "User Already Exists", insertId: null },
        409
      );
    }

    const result = await usersCollection.insertOne(user);
    sendResponse(
      res,
      { message: "User added successfully", insertId: result.insertedId },
      201
    );
  } catch (error) {
    console.error("Error adding user:", error);
    sendResponse(res, { message: "Failed to add user" }, 500);
  }
};

// Get all users with pagination
exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 5;
    const skip = (page - 1) * limit;

    const users = await usersCollection
      .find()
      .skip(skip)
      .limit(limit)
      .toArray();
    const totalDocuments = await usersCollection.countDocuments();
    const totalPages = Math.ceil(totalDocuments / limit);

    sendResponse(res, {
      users,
      currentPage: page,
      totalPages,
      totalDocuments,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    sendResponse(res, { error: "Failed to retrieve user list" }, 500);
  }
};

// Get current user by email
exports.getCurrentUser = async (req, res) => {
  const email = req.params.email;

  try {
    const result = await usersCollection.findOne({ email });

    if (!result) {
      return sendResponse(res, { message: "User not found." }, 404);
    }

    sendResponse(res, result);
  } catch (error) {
    console.error("Error fetching user:", error);
    sendResponse(res, { message: "Failed to fetch user" }, 500);
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  const email = req.params.email;
  const updatedData = req.body;

  try {
    const result = await usersCollection.updateOne(
      { email },
      { $set: updatedData }
    );

    if (result.modifiedCount === 0) {
      return sendResponse(res, { message: "No changes made" }, 204);
    }

    sendResponse(res, { modifiedCount: result.modifiedCount });
  } catch (error) {
    console.error("Error updating user profile:", error);
    sendResponse(res, { message: "Failed to update user profile" }, 500);
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return sendResponse(res, { message: "Invalid User ID" }, 400);
  }

  try {
    const query = { _id: new ObjectId(id) };
    const result = await usersCollection.deleteOne(query);

    if (result.deletedCount === 0) {
      return sendResponse(res, { message: "User not found" }, 404);
    }

    sendResponse(res, {
      message: "User deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    sendResponse(res, { message: "Failed to delete user" }, 500);
  }
};

// Update user role
exports.updateUserRole = async (req, res) => {
  const id = req.params.id;
  const { role } = req.body;

  if (!ObjectId.isValid(id)) {
    return sendResponse(res, { message: "Invalid User ID" }, 400);
  }

  try {
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { role } }
    );

    if (result.modifiedCount === 0) {
      return sendResponse(res, { message: "No changes made" }, 204);
    }

    console.log(`Modified count: ${result.modifiedCount}`);
    sendResponse(res, { modifiedCount: result.modifiedCount });
  } catch (error) {
    console.error("Error updating user role:", error);
    sendResponse(res, { message: "Failed to update user role" }, 500);
  }
};
