const { client, ObjectId } = require("../config/db");
const recruitersCollection = client
  .db("hiringStaffDB")
  .collection("recruiters");

// function for sending responses
const sendResponse = (res, data, statusCode = 200) => {
  res.status(statusCode).json(data);
};

exports.addRecruiter = async (req, res) => {
  try {
    const recruiter = req.body;
    const query = { _id: recruiter._id };
    const existingRecruiter = await recruitersCollection.findOne(query);

    if (existingRecruiter) {
      return sendResponse(
        res,
        { message: "Recruiter Already Exists", insertId: null },
        409
      );
    }

    const result = await recruitersCollection.insertOne(recruiter);
    sendResponse(
      res,
      { message: "Recruiter added successfully", insertId: result.insertedId },
      201
    );
  } catch (error) {
    console.error("Error adding Recruiter:", error);
    sendResponse(res, { message: "Failed to add Recruiter" }, 500);
  }
};

// Get current user by email
exports.getCurrentRecruiter = async (req, res) => {
  const email = req.params.email;

  try {
    const result = await recruitersCollection.findOne({ email });

    if (!result) {
      return sendResponse(res, { message: "recruiter not found." }, 404);
    }

    sendResponse(res, result);
  } catch (error) {
    console.error("Error fetching recruiter:", error);
    sendResponse(res, { message: "Failed to fetch recruiter" }, 500);
  }
};

// Get a specific recruiter by ID
exports.getRecruiterById = async (req, res) => {
  const recruiterId = req.params.id;

  // Validate the ObjectId
  if (!ObjectId.isValid(recruiterId)) {
    return sendResponse(res, { message: "Invalid Recruiter ID." }, 400);
  }

  try {
    const result = await recruitersCollection.findOne({
      _id: new ObjectId(recruiterId),
    });

    if (!result) {
      return sendResponse(res, { message: "Recruiter not found." }, 404);
    }

    sendResponse(res, result);
  } catch (error) {
    console.error("Error fetching recruiter by ID: ", error);
    sendResponse(res, { message: "An error occurred." }, 500);
  }
};

// get all recruiter with filtering
exports.getAllRecruiters = async (req, res) => {
  try {
    const industry = req.query.industry || "";
    const location = req.query.city || "";
    const numberOfEmployees = req.query.numberOfEmployees || "";

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    const query = {};

    if (industry) {
      query.industry = { $regex: industry, $options: "i" };
    }

    if (location) {
      query["location.city"] = { $regex: location, $options: "i" };
    }

    if (numberOfEmployees) {
      query.numberOfEmployees = { $lte: parseInt(numberOfEmployees) };
    }

    const recruiters = await recruitersCollection
      .find(query)
      .skip(skip)
      .limit(limit)
      .toArray();

    if (recruiters.length === 0) {
      return res.status(404).json({ message: "No recruiters found" });
    }

    const totalRecruiters = await recruitersCollection.countDocuments(query);

    res.json({
      totalPages: Math.ceil(totalRecruiters / limit),
      currentPage: page,
      totalRecruiters,
      recruiters,
    });
  } catch (error) {
    console.error("Error fetching recruiters:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch recruiters", error: error.message });
  }
};

// uniqe data
exports.getRecruitersData = async (req, res) => {
  try {
    const [industries, cities, teamSizes] = await Promise.all([
      recruitersCollection
        .aggregate([
          {
            $group: {
              _id: "$industry",
            },
          },
          {
            $project: {
              _id: 0,
              industry: "$_id",
            },
          },
        ])
        .toArray(),

      recruitersCollection
        .aggregate([
          {
            $group: {
              _id: "$location.city",
            },
          },
          {
            $project: {
              _id: 0,
              city: "$_id",
            },
          },
        ])
        .toArray(),

      recruitersCollection
        .aggregate([
          {
            $group: {
              _id: "$numberOfEmployees",
            },
          },
          {
            $project: {
              _id: 0,
              teamSize: "$_id",
            },
          },
        ])
        .toArray(),
    ]);

    const flatIndustries = industries.map((i) => i.industry);
    const flatCities = cities.map((c) => c.city);
    const flatTeamSizes = teamSizes.map((t) => t.teamSize);

    res.json({
      industries: flatIndustries,
      cities: flatCities,
      teamSizes: flatTeamSizes,
    });
  } catch (error) {
    console.error("Error fetching recruiters data:", error);
    res
      .status(500)
      .json({ message: "Error fetching data", error: error.message });
  }
};

exports.addRecruiter = async (req, res) => {
  try {
    const recruiter = req.body;
    const query = { _id: recruiter._id };
    const existingRecruiter = await recruitersCollection.findOne(query);

    if (existingRecruiter) {
      return sendResponse(
        res,
        { message: "Recruiter Already Exists", insertId: null },
        409
      );
    }

    const result = await recruitersCollection.insertOne(recruiter);
    sendResponse(
      res,
      { message: "Recruiter added successfully", insertId: result.insertedId },
      201
    );
  } catch (error) {
    console.error("Error adding Recruiter:", error);
    sendResponse(res, { message: "Failed to add Recruiter" }, 500);
  }
};
