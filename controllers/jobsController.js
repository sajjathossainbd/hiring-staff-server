const { ObjectId } = require("mongodb");
const { client } = require("../config/db");
const jobsCollection = client.db("hiringStaffDB").collection("jobs");
const appliedJobsCollection = client
  .db("hiringStaffDB")
  .collection("appliedjobs");

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

// get all job with filter
exports.getAllJobsWithFilter = async (req, res) => {
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
      limit,
    } = req.query;

    const query = {};

    // Categories filtering
    if (category) {
      query.category = new RegExp(category, "i");
    }

    // Title and keywords filtering
    if (job_title) {
      const regex = new RegExp(job_title, "i");
      query.$or = [{ jobTitle: regex }, { tags: regex }];
    }

    // Job type filtering
    if (job_type) {
      query.job_type = new RegExp(job_type, "i");
    }

    // Job location filtering
    if (job_location) {
      query.job_location = new RegExp(job_location, "i");
    }

    // Posted date range filtering
    if (posted_within) {
      const dateLimit = new Date();
      dateLimit.setDate(dateLimit.getDate() - Number(posted_within));
      query.postedDate = {
        $gte: dateLimit.toISOString().split("T")[0],
      };
    }

    // Salary range filtering
    if (min_salary || max_salary) {
      const conditions = [];

      if (min_salary) {
        conditions.push({
          $gte: [{ $toInt: "$min_salary" }, parseInt(min_salary, 10)],
        });
      }

      if (max_salary) {
        conditions.push({
          $lte: [{ $toInt: "$max_salary" }, parseInt(max_salary, 10)],
        });
      }

      if (conditions.length > 0) {
        query.$expr = { $and: conditions };
      }
    }

    // Pagination setup
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
    res
      .status(500)
      .json({ message: "Error fetching jobs", error: error.message });
  }
};

// get all unique category
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

// get all unique location
exports.getUniqueLocation = async (req, res) => {
  try {
    const locations = await jobsCollection
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

    const locationNames = locations.map((loc) => loc.job_location);

    if (locationNames.length === 0) {
      return res.status(404).json({ message: "No locations found!" });
    }
    res.json(locationNames);
  } catch (error) {
    // Handle any errors
    res.status(500).json({ message: "Error fetching locations" });
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

// Delete job
exports.deleteJob = async (req, res) => {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return sendResponse(res, { message: "Invalid User ID" }, 400);
  }

  try {
    const query = { _id: new ObjectId(id) };
    const result = await jobsCollection.deleteOne(query);

    if (result.deletedCount === 0) {
      return sendResponse(res, { message: "Job not found" }, 404);
    }

    sendResponse(res, {
      message: "Job deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting Job:", error);
    sendResponse(res, { message: "Failed to delete Job" }, 500);
  }
};

// applied job
exports.appliedJobApplication = async (req, res) => {
  const {
    jobId,
    jobTitle,
    company_email,
    company_id,
    applicantId,
    applicantName,
    applicantEmail,
    coverLetter,
    resume,
    availability,
  } = req.body;

  try {
    const job = await jobsCollection.findOne({ _id: new ObjectId(jobId) });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const applicationData = {
      jobId,
      jobTitle,
      company_email,
      company_id,
      applicantId,
      applicantName,
      applicantEmail,
      coverLetter,
      resume,
      availability,
      appliedDate: new Date(),
    };

    const result = await appliedJobsCollection.insertOne(applicationData);
    console.log(result);

    if (result.acknowledged) {
      res.status(201).json({
        message: "Application submitted successfully",
        applicationId: result.insertedId,
      });
    } else {
      res.status(500).json({ message: "Failed to submit application" });
    }
  } catch (error) {
    console.error("Error submitting job application:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get applied jobs for a specific applicant
exports.getAppliedJobs = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Applicant ID" });
    }

    const appliedJobs = await appliedJobsCollection
      .find({
        applicantId: new ObjectId(id),
      })
      .toArray();

    if (appliedJobs.length > 0) {
      return res.status(200).json(appliedJobs);
    } else {
      return res
        .status(404)
        .json({ message: "No applied jobs found for this applicant." });
    }
  } catch (error) {
    console.error("Error fetching applied jobs:", error);
    return res.status(500).json({ message: "Error fetching applied jobs." });
  }
};

// applier delete on job
exports.deleteJobApplication = async (req, res) => {
  const id = req.params.id; // Job ID
  const email = req.body.email; // Email of the user whose application is to be deleted

  try {
    const result = await jobsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $pull: { appliers: { email: email } } } // Remove application based on email
    );

    if (result.matchedCount === 0) {
      return sendResponse(
        res,
        { message: "No application found to delete" },
        404
      ); // Change to 404 for not found
    }

    sendResponse(res, {
      modifiedCount: result.modifiedCount,
      message: "Application successfully deleted",
    });
  } catch (error) {
    console.error("Error deleting job application:", error);
    sendResponse(res, { message: "Failed to delete job application" }, 500);
  }
};
