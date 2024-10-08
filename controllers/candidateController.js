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
    const limit = parseInt(req.query.limit) || 3;
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
      switch (jobType.toLowerCase()) {
        case "remote":
          query.job_type = "remote";  
          break;
        case "onsite":
          query.job_type = "onsite";  
          break;
        case "hybrid":
          query.job_type = "hybrid";  
          break;
        default:
          return res.status(400).json({ message: "Invalid job type" });
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

// Get unique data
exports.getCandidatesData = async (req, res) => {
  try {
    const [professions, cities, skills, experience, education] = await Promise.all([
      
      candidatesCollection.aggregate([
        {
          $group: {
            _id: "$special_profession",
          },
        },
        {
          $project: {
            _id: 0,
            profession: "$_id",
          },
        },
      ]).toArray(),

   
      candidatesCollection.aggregate([
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
      ]).toArray(),

       candidatesCollection.aggregate([
        {
          $unwind: "$skills",
        },
        {
          $group: {
            _id: "$skills",
          },
        },
        {
          $project: {
            _id: 0,
            skill: "$_id",
          },
        },
      ]).toArray(),

       candidatesCollection.aggregate([
        {
          $group: {
            _id: "$experience_year",
          },
        },
        {
          $project: {
            _id: 0,
            experience: "$_id",
          },
        },
      ]).toArray(),

       candidatesCollection.aggregate([
        {
          $unwind: "$education",
        },
        {
          $group: {
            _id: "$education.degree",
          },
        },
        {
          $project: {
            _id: 0,
            degree: "$_id",
          },
        },
      ]).toArray(),
    ]);

     const flatProfessions = professions.map((p) => p.profession);
    const flatCities = cities.map((c) => c.city);
    const flatSkills = skills.map((s) => s.skill);
    const flatExperience = experience.map((e) => e.experience);
    const flatEducation = education.map((ed) => ed.degree);

    res.json({
      professions: flatProfessions,
      cities: flatCities,
      skills: flatSkills,
      experience: flatExperience,
      education: flatEducation,
    });
  } catch (error) {
    console.error("Error fetching candidates data:", error);
    res.status(500).json({ message: "Error fetching data", error: error.message });
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

 