// controllers/recruitersController.js

const { client, ObjectId } = require("../config/db");
const recruitersCollection = client
  .db("hiringStaffDB")
  .collection("recruiters");


exports.getAllRecruiters = async (req, res) => {
  const result = await recruitersCollection.find().toArray();
  
  res.send(result);
};


exports.getRecruiterById = async (req, res) => {
  const recruiterId = req.params.id;
  const result = await recruitersCollection.findOne({
    _id: new ObjectId(recruiterId),
  });
  res.send(result);
};

exports.getAllRecruiters = async (req, res) => {
  try {
    const { search, country, city, industry, organization, teamSize, page = 1, limit = 10 } = req.query;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const query = {};

    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { organization: { $regex: search, $options: "i" } }
      ];
    }

    // Filtering by location
    if (country) {
      query["location.country"] = { $regex: new RegExp(country, "i") };
    }
    if (city) {
      query["location.city"] = { $regex: new RegExp(city, "i") };
    }

    // Additional filters
    if (industry) {
      query.industry = { $regex: new RegExp(industry, "i") };
    }
    if (organization) {
      query.organization = { $regex: new RegExp(organization, "i") };
    }
    if (teamSize) {
      query.teamSize = teamSize;
    }

    // Apply pagination using skip and limit
    const result = await recruitersCollection
      .find(query)
      .skip((pageNumber - 1) * limitNumber) 
      .limit(limitNumber)                    
      .toArray();

  
    const totalDocuments = await recruitersCollection.countDocuments(query);

    res.status(200).json({
      data: result,
      total: totalDocuments,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(totalDocuments / limitNumber),
    });
  } catch (error) {
    res.status(500).send({ message: "Error fetching recruiters", error });
  }
};

  

