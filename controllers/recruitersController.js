const { client, ObjectId } = require("../config/db");
const recruitersCollection = client
  .db("hiringStaffDB")
  .collection("recruiters");


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

    const result = await recruitersCollection
      .find(query)
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber)
      .toArray();

    const totalDocuments = await recruitersCollection.countDocuments(query);

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

exports.getRecruiterById = async (req, res) => {
  try {
    const recruiterId = req.params.id;

    // Validate recruiterId
    if (!ObjectId.isValid(recruiterId)) {
      return res.status(400).json({ message: "Invalid recruiter ID format" });
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

// Fetching unique data
exports.getRecruitersData = async (req, res) => {
  try {
    const [industries, cities, countries, teamSizes] = await Promise.all([
      recruitersCollection
        .aggregate([
          { $group: { _id: { $ifNull: ["$industry", "Unknown Industry"] } } },
        ])
        .toArray(),
      recruitersCollection
        .aggregate([
          { $group: { _id: { $ifNull: ["$location.city", "Unknown City"] } } },
        ])
        .toArray(),
      recruitersCollection
        .aggregate([
          {
            $group: {
              _id: { $ifNull: ["$location.country", "Unknown Country"] },
            },
          },
        ])
        .toArray(),
      recruitersCollection
        .aggregate([{ $group: { _id: "$numberOfEmployees" } }])
        .toArray(),
    ]);

    // Simplified extraction of unique data
    const flatIndustries = industries.map(({ _id }) => _id);
    const flatCities = cities.map(({ _id }) => _id);
    const flatCountries = countries.map(({ _id }) => _id);
    const flatTeamSizes = teamSizes.map(({ _id }) => _id);

    res.status(200).json({
      uniqueData: {
        industries: flatIndustries,
        cities: flatCities,
        countries: flatCountries,
        teamSizes: flatTeamSizes,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching unique recruiter data", error });
  }
};

exports.addRecruiter = async (req, res) => {
  try {
    const recruiter = req.body; // Assuming recruiter details are sent in the request body
    const result = await recruitersCollection.insertOne(recruiter);
    res.status(201).send(result);
  } catch (error) {
    res.status(500).json({ message: "Error adding recruiter", error });
  }
};