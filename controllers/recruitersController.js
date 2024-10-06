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
    const { page = 1, limit = 10, search = '', location = '', industry = '', organization = '', teamSize = '' } = req.query;

    
    const skip = (page - 1) * limit;
    const query = {};

   
    if (search) {
      query.name = { $regex: search, $options: 'i' }; 
    }

   
    if (location) {
      query['location.city'] = { $regex: location, $options: 'i' }; 
    }

    if (industry) {
      query.industry = { $regex: industry, $options: 'i' }; 
    }

   
    if (organization) {
      query.name = { $regex: organization, $options: 'i' }; 
    }


    if (teamSize) {
      const numberOfEmployees = parseInt(teamSize);
      if (!isNaN(numberOfEmployees)) {
        query.numberOfEmployees = numberOfEmployees;
      }
    }

    
    const result = await recruitersCollection.find(query).skip(skip).limit(parseInt(limit)).toArray();
    
 
    const totalCount = await recruitersCollection.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);

    res.send({
      data: result,
      totalPages,
      currentPage: parseInt(page),
      totalCount
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error fetching recruiters" });
  }
};

