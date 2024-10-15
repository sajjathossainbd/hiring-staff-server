const { client, ObjectId } = require("../config/db");
const recruitersCollection = client
  .db("hiringStaffDB")
  .collection("recruiters");

exports.getAllRecruiters = async (req, res) => {
  try {
    const result = await recruitersCollection.find().toArray();
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Error fetching recruiters", error });
  }
};

exports.getRecruiterById = async (req, res) => {
  try {
    const recruiterId = req.params.id;

    // Validate recruiterId
    if (!ObjectId.isValid(recruiterId)) {
      return res.status(400).json({ message: "Invalid recruiter ID" });
    }

    const result = await recruitersCollection.findOne({
      _id: new ObjectId(recruiterId),
    });

    if (!result) {
      return res.status(404).json({ message: "Recruiter not found" });
    }

    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Error fetching recruiter", error });
  }
};

exports.getAllRecruiters = async (req, res) => {
  try {
    const {
      search,
      country,
      city,
      industry,
      numberOfEmployees,
      page = 1,
      limit = 3,
    } = req.query;

    // Parse page and limit to numbers
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const query = {};

    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { organization: { $regex: search, $options: "i" } },
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
    if (numberOfEmployees) {
      query.numberOfEmployees = parseInt(numberOfEmployees); // Exact match
    }


    // Apply pagination using skip and limit
    const result = await recruitersCollection
      .find(query)
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber)
      .toArray();
  
    // Get total documents count for pagination info
    const totalDocuments = await recruitersCollection.countDocuments(query);

    // Respond with the results and pagination data
    res.status(200).json({
      data: result,
      totalDocuments,
      currentPage: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(totalDocuments / limitNumber),
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching recruiters", error });
  }
};

// Fetching unique data
exports.getRecruitersData = async (req, res) => {
  try {
    const [industries, cities, countries, teamSizes] = await Promise.all([
      // Aggregate industries
      recruitersCollection.aggregate([
        {
          $group: {
            _id: { $ifNull: ["$industry", "Unknown Industry"] }, // Correct aggregation for industry
          },
        },
        {
          $project: {
            _id: 0,
            industry: "$_id",
          },
        },
      ]).toArray(),

      // Aggregate cities
      recruitersCollection.aggregate([
        {
          $group: {
            _id: { $ifNull: ["$location.city", "Unknown City"] },
          },
        },
        {
          $project: {
            _id: 0,
            city: "$_id",
          },
        },
      ]).toArray(),

      // Aggregate countries
      recruitersCollection.aggregate([
        {
          $group: {
            _id: { $ifNull: ["$location.country", "Unknown Country"] }, // Correct aggregation for country
          },
        },
        {
          $project: {
            _id: 0,
            country: "$_id",
          },
        },
      ]).toArray(),

      // Aggregate team sizes
      recruitersCollection.aggregate([
        {
          $group: {
            _id: "$numberOfEmployees",
          },
        },
        {
          $project: {
            _id: 0,
            numberOfEmployees: "$_id",
          },
        },
      ]).toArray(),
    ]);

    // Flatten the arrays correctly
    const flatIndustries = industries.map((industry) => industry.industry);
    const flatCities = cities.map((city) => city.city);
    const flatCountries = countries.map((country) => country.country);
    const flatTeamSizes = teamSizes.map((size) => size.numberOfEmployees);

  
    // Responding with the unique data
    res.status(200).json({
      uniqueData: {
        industries: flatIndustries,
        cities: flatCities,
        countries: flatCountries,
        teamSizes: flatTeamSizes,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching unique recruiter data", error });
  }
};


