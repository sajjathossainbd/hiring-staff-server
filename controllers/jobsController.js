const { ObjectId } = require("mongodb");
const { client } = require("../config/db");
const jobsCollection = client.db("hiringStaffDB").collection("jobs");

// function for sending responses
const sendResponse = (res, data, statusCode = 200) => {
  res.status(statusCode).json(data);
};

// Post a job
exports.postJob = async (req, res) => {
  try {
    const jobData = req.body;
    const query = { jobTitle: jobData.jobTitle };
    // const query = { jobTitle: new RegExp(`^${jobData.jobTitle}$`, "i") };
    const existingJob = await jobsCollection.findOne(query);

    if (existingJob) {
      return sendResponse(
        res,
        { message: "Job Already Exists", insertId: null },
        409
      );
    }

    const result = await jobsCollection.insertOne(jobData);
    sendResponse(res, {
      message: "Job posted successfully",
      insertId: result.insertedId,
    });
  } catch (error) {
    console.error("Error posting job:", error);
    sendResponse(res, { message: "Failed to post job" }, 500);
  }
};
// get all jobs
exports.getAllJobs = async (req, res) => {
  try {
    const {
      category,
      job_title,
      job_location,
      job_type,
      posted_within,
      min_salary,
      max_salary,
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};

    // categories
    if (category) {
      const categoriesArray = category.split(",").map((cat) => cat.trim());
      query.category = { $in: categoriesArray };
    }

    // title and keywords
    if (job_title) {
      const regex = new RegExp(job_title, "i");
      query.$or = [{ jobTitle: regex }, { tags: regex }];
    }

    // job type
    if (job_type) {
      query.job_type = new RegExp(job_type, "i");
    }

    // job location
    if (job_location) {
      query.job_location = new RegExp(job_location, "i");
    }

    // posted date
    if (posted_within) {
      const dateLimit = new Date();
      dateLimit.setDate(dateLimit.getDate() - Number(posted_within));
      query.postedDate = { $gte: dateLimit };
    }

    // salary range filtering
    if (min_salary || max_salary) {
      if (min_salary) {
        query.salary_max = { $gte: parseInt(min_salary) };
      }
      if (max_salary) {
        query.salary_min = { $lte: parseInt(max_salary) };
      }
    }

    // pagination
    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);
    const skip = (pageNumber - 1) * pageSize;

    // Fetch jobs with pagination
    const result = await jobsCollection
      .find(query)
      .skip(skip)
      .limit(pageSize)
      .toArray();

    if (result.length === 0) {
      return res.status(404).json({ message: "No jobs found" });
    }

    const totalCount = await jobsCollection.countDocuments(query);
    res.json({
      totalJobs: totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
      currentPage: pageNumber,
      jobs: result,
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ message: "Error fetching jobs" });
  }
};

// get all category
exports.getUniqueCategories = async (req, res) => {
  try {
    const categories = await jobsCollection
      .aggregate([
        {
          $group: {
            _id: "$category",
          },
        },
        {
          $project: {
            _id: 0,
            category: "$_id",
          },
        },
      ])
      .toArray();

    const categoryNames = categories.map((cat) => cat.category);

    if (categoryNames.length === 0) {
      return res.status(404).json({ message: "No categories found" });
    }

    res.json(categoryNames);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Error fetching categories" });
  }
};

// get all location
exports.getUniqueLocation = async () => {
  try {
    const locations = jobsCollection
      .aggregate([
        {
          $group: {
            _id: "$job_location",
          },
        },
        {
          $project: {
            _id: 0,
            job_location: "$_id",
          },
        },
      ])
      .toArray();

    const LocationNames = locations.map((loc) => loc.job_location);

    if (LocationNames.length === 0) {
      return res.status(500).json({ message: "No location found!" });
    }
    res.json(LocationNames);
  } catch (error) {
    res.status(500).json({ message: "Error fetching location" });
  }
};

// Get a single job
exports.getJob = async (req, res) => {
  try {
    const jobId = req.params.id;

    if (!ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: "Invalid Job ID" });
    }

    const job = await jobsCollection.findOne({ _id: new ObjectId(jobId) });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json(job);
  } catch (error) {
    console.error("Error fetching job:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get job by recruiter email
exports.getJobsByEmail = async (req, res) => {
  try {
    const email = req.params.email;
    const query = { company_email: email };
    const result = await jobsCollection.find(query).toArray();

    if (result.length === 0) {
      return sendResponse(
        res,
        { message: "No jobs found for this email" },
        404
      );
    }

    sendResponse(res, result);
  } catch (error) {
    console.error("Error fetching jobs by email:", error);
    sendResponse(res, { message: "Error fetching jobs" }, 500);
  }
};
