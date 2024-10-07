const { client, ObjectId } = require("../config/db");
const candidatesCollection = client
  .db("hiringStaffDB")
  .collection("candidates");

// function for sending responses
const sendResponse = (res, data, statusCode = 200) => {
  res.status(statusCode).json(data);
};

// Get all candidates
exports.getAllCandidates = async (req, res) => {
  try {
    const profession = req.query.profession || "";
    const location = req.query.location || "";
    const skills = req.query.skills || "";
    const experience = req.query.experience || "";
    const education = req.query.education || "";
    const jobType = req.query.jobType || "";
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};

    if (profession) {
      query.special_profession = { $regex: profession, $options: "i" };
    }

    if (location) {
      query["location.city"] = { $regex: location, $options: "i" };
    }

    if (skills) {
      const skillArray = skills.split(",").map((skill) => skill.trim());
      query.skills = {
        $all: skillArray.map((skill) => new RegExp(skill, "i")),
      };
    }

    if (experience) {
      query.experience_year = parseInt(experience);
    }

    if (education) {
      query["education.degree"] = { $regex: education, $options: "i" };
    }

    if (jobType) {
      if (jobType === "remote") {
      } else if (jobType === "onsite") {
      } else if (jobType === "hybrid") {
      }
    }

    const candidates = await candidatesCollection
      .find(query)
      .skip(skip)
      .limit(limit)
      .toArray();

    if (candidates.length === 0) {
      return res.status(404).json({ message: "No candidates found" });
    }
    const totalCandidates = await candidatesCollection.countDocuments(query);
    res.json({
    
      totalPages: Math.ceil(totalCandidates / limit),
      currentPage: page,
      totalCandidates,
      candidates
    });
  } catch (error) {
    console.error("Error fetching candidates:", error);
    sendResponse(res, { message: "Failed to fetch candidates" }, 500);
  }
};

// Get candidate by id
exports.getCandidateById = async (req, res) => {
  // console.log(req.params);
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return sendResponse(res, { message: "Invalid candidate ID" }, 400);
  }

  try {
    const result = await candidatesCollection.findOne({
      _id: new ObjectId(id),
    });
    if (!result) {
      return sendResponse(res, { message: "Candidate not found" }, 404);
    }
    sendResponse(res, result);
  } catch (error) {
    console.error("Error fetching candidate by ID:", error);
    sendResponse(res, { message: "Failed to fetch candidate" }, 500);
  }
};

 