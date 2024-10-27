const { ObjectId } = require("mongodb");
const { client } = require("../config/db");
const jobsCollection = client.db("hiringStaffDB").collection("jobs");
const appliedJobsCollection = client
  .db("hiringStaffDB")
  .collection("appliedjobs");
const sendEmail = require("../utils/sendEmail");

// function for sending responses
const sendResponse = (res, data, statusCode = 200) => {
  res.status(statusCode).json(data);
};

// Post a job
exports.postJob = async (req, res) => {
  try {
    const jobData = req.body;
    const { jobTitle, company_email, candidateEmails, company_name } = jobData;

    const query = { jobTitle: jobData.jobTitle };
    const existingJob = await jobsCollection.findOne(query);
    if (existingJob) {
      return sendResponse(
        res,
        { message: "Job Already Exists", insertId: null },
        409
      );
    }

    const result = await jobsCollection.insertOne(jobData);

    const message = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #4CAF50;">New Job Opportunity!</h2>
      <p style="font-size: 16px;">
        A new job titled <strong style="color: #333;">${jobTitle}</strong> has been posted by 
        <strong style="color: #0073e6;">${company_name}</strong>.
      </p>
      <p style="font-size: 16px; margin-top: 20px;">
        <em>Check it out now on Hiring Staff!</em>
      </p>
      <div style="margin-top: 30px;">
        <a 
          href="http://localhost:5000/jobs/id" 
          style="background-color: #0073e6; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          View Job Details
        </a>
      </div>
      <p style="margin-top: 40px; font-size: 14px; color: #777;">
        Best regards,<br />
        <strong>Hiring Staff Team</strong>
      </p>
      <hr style="border: none; border-top: 1px solid #ddd; margin-top: 40px;">
      <footer style="font-size: 12px; color: #777;">
        This email was sent to you because you subscribed to job notifications on Hiring Staff. 
        If you no longer wish to receive these emails, you can <a href="#" style="color: #0073e6;">unsubscribe</a> at any time.
      </footer>
    </div>
  `;

    for (const candidateEmail of candidateEmails) {
      await sendEmail({
        recruiterName: company_name,
        recruiterEmail: company_email,
        email: candidateEmail,
        subject: `New Job Opportunity: ${jobTitle}`,
        message,
      });
    }

    sendResponse(res, {
      message: "Job posted successfully and emails sent",
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

// Get jobs by recruiter email for recruiter dashboard
exports.getJobsByEmail = async (req, res) => {
  try {
    const email = req.params.email;

    const result = await jobsCollection
      .aggregate([
        { $match: { company_email: email } },
        {
          $lookup: {
            from: "appliedjobs",
            localField: "_id",
            foreignField: "jobId",
            as: "applications",
          },
        },
        {
          $project: {
            jobTitle: 1,
            company_email: 1,
            postedDate: 1,
            lastDateToApply: 1,
            applications: 1,
            applicationsCount: { $size: "$applications" },
          },
        },
      ])
      .toArray();

    if (result.length === 0) {
      return res.status(404).json({ message: "No jobs found for this email" });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching jobs by email:", error);
    res.status(500).json({ message: "Error fetching jobs" });
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

// apply job
exports.appliedJobApplication = async (req, res) => {
  const {
    jobId,
    jobTitle,
    company_email,
    company_name,
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

    const existingApplication = await appliedJobsCollection.findOne({
      jobId: new ObjectId(jobId),
      applicantId: new ObjectId(applicantId),
    });

    if (existingApplication) {
      return res
        .status(409)
        .json({ message: "You have already applied for this job" });
    }

    const applicationData = {
      _id: new ObjectId(),
      jobId: new ObjectId(jobId),
      jobTitle,
      company_email,
      company_name,
      applicantId: new ObjectId(applicantId),
      applicantName,
      applicantEmail,
      coverLetter,
      resume,
      availability,
      shortlist: "pending",
      reject: false,
      selected: false,
      appliedDate: new Date(),
    };

    const result = await appliedJobsCollection.insertOne(applicationData);

    if (result.acknowledged) {
      res.status(201).json({
        message: "Application submitted successfully",
        applicationId: result.insertedId,
      });
    }
  } catch (error) {
    console.error("Error submitting job application:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all applied jobs

exports.getAllAppliedJobs = async (req, res) => {
  try {
    const appliedJobs = await appliedJobsCollection.find().toArray();

    if (appliedJobs.length > 0) {
      return res.status(200).json(appliedJobs);
    } else {
      return res.status(404).json({ message: "No applied jobs found." });
    }
  } catch (error) {
    console.error("Error fetching applied jobs:", error);
    return res.status(500).json({ message: "Error fetching applied jobs." });
  }
};

// Get applied jobs for a specific applicant
exports.getAppliedJobsById = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query; // Get page and limit from query parameters

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Applicant ID" });
    }

    // Convert page and limit to numbers
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    // Calculate the number of jobs to skip
    const skip = (pageNum - 1) * limitNum;

    const appliedJobs = await appliedJobsCollection
      .find({ applicantId: new ObjectId(id) })
      .skip(skip) // Skip the first 'skip' jobs
      .limit(limitNum) // Limit to 'limitNum' jobs
      .toArray();

    const totalJobs = await appliedJobsCollection.countDocuments({
      applicantId: new ObjectId(id),
    });

    if (appliedJobs.length > 0) {
      return res.status(200).json({
        totalJobs, // Include total jobs for pagination
        totalPages: Math.ceil(totalJobs / limitNum), // Calculate total pages
        currentPage: pageNum, // Include current page
        appliedJobs, // Return the applied jobs
      });
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

// Delete controller for applied jobs

exports.deleteAppliedJob = async (req, res) => {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return sendResponse(res, { message: "Invalid User ID" }, 400);
  }

  try {
    const query = { _id: new ObjectId(id) };
    const result = await appliedJobsCollection.deleteOne(query);

    if (result.deletedCount === 0) {
      return sendResponse(res, { message: "Job not found" }, 404);
    }

    sendResponse(res, {
      message: "Applied Job deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting Job:", error);
    sendResponse(res, { message: "Failed to delete Job" }, 500);
  }
};

// get applied job by shortlisted

exports.getAppliedJobByShortlist = async (req, res) => {
  try {
    const appliedJobs = await appliedJobsCollection
      .find({ shortlist: "approved" })
      .toArray();

    if (!appliedJobs.length) {
      return res.status(404).json({ message: "No jobs found in shortlist" });
    }

    return res.status(200).json(appliedJobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return res.status(500).json({ message: "Error fetching jobs" });
  }
};

// Get applied jobs by email address

exports.getAppliedJobsByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    const appliedJobs = await appliedJobsCollection
      .find({
        company_email: email,
      })
      .toArray();

    if (appliedJobs.length > 0) {
      return res.status(200).json(appliedJobs);
    } else {
      return res
        .status(404)
        .json({ message: "No applied jobs found for this email address." });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error fetching applied jobs." });
  }
};

// Update applied job status

exports.updateAppliedJobStatus = async (req, res) => {
  const { id } = req.params;
  const { shortlist, reject } = req.body; // Accept both shortlist and reject values from the request

  if (!ObjectId.isValid(id)) {
    return sendResponse(res, { message: "Invalid Job ID" }, 400);
  }

  try {
    const query = { _id: new ObjectId(id) };

    // Dynamically build the update object based on the provided fields
    const update = {
      $set: {},
    };
    if (shortlist) update.$set.shortlist = shortlist; // e.g., 'approved', 'pending'
    if (typeof reject === "boolean") update.$set.reject = reject; // e.g., true or false

    const result = await appliedJobsCollection.updateOne(query, update);

    if (result.matchedCount === 0) {
      return sendResponse(res, { message: "Job not found" }, 404);
    }

    sendResponse(res, {
      message: "Applied Job status updated successfully",
      updatedCount: result.matchedCount,
    });
  } catch (error) {
    console.error("Error updating applied job status:", error);
    sendResponse(res, { message: "Error updating job status" }, 500);
  }
};

exports.getAppliedJobsByEmailAndShortlist = async (req, res) => {
  try {
    const { email } = req.params;

    const appliedJobs = await appliedJobsCollection
      .find({
        company_email: email,
        shortlist: "approved",
      })
      .toArray();

    if (appliedJobs.length > 0) {
      return res.status(200).json(appliedJobs);
    } else {
      return res
        .status(404)
        .json({ message: "No shortlisted jobs found for this email address." });
    }
  } catch (error) {
    console.error("Error fetching applied jobs:", error);
    return res.status(500).json({ message: "Error fetching applied jobs." });
  }
};

// API to update the 'selected' status of an applied job
exports.updateJobSelectedStatus = async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Job ID" });
    }

    const query = { _id: new ObjectId(id) };
    const update = { $set: { selected: true } };

    const result = await appliedJobsCollection.updateOne(query, update);

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json({
      message: "Job status updated successfully",
      updatedCount: result.modifiedCount,
    });

    const appliedJob = await appliedJobsCollection.findOne(query);
    const applicantEmail = appliedJob.applicantEmail;

    if (appliedJob) {
      const { jobTitle, company_name } = appliedJob;
      const message = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #4CAF50;">Congratulations, ${appliedJob.applicantName}!</h2>
          <p style="font-size: 16px;">
            You have been selected for the position of <strong>${jobTitle}</strong> at <strong>${company_name}</strong>.
          </p>
             <div style="margin-top: 30px;">
        <a 
          href="https://hiring-staff.vercel.app/job-details/id" 
          style="background-color: #0073e6; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          View Job Details
        </a>
      </div>
          <p style="font-size: 16px; margin-top: 20px;">
            We will contact you shortly with further details.
          </p>
          <p style="margin-top: 40px; font-size: 14px; color: #777;">
            Best regards,<br />
            <strong>Hiring Staff Team</strong>
          </p>
        </div>
      `;

      await sendEmail({
        recruiterName: company_name,
        email: applicantEmail,
        subject: `You Have Been Selected for ${jobTitle}!`,
        message,
      });
    }
  } catch (error) {
    console.error("Error updating job status:", error);
    res.status(500).json({ message: "Error updating job status." });
  }
};

// get aproved shortlist data for candidates
exports.getApprovedShortlistedJobs = async (req, res) => {
  const { email } = req.params;
  const { page = 1, limit = 12 } = req.query; // Get pagination parameters from query

  try {
    const skip = (page - 1) * limit; // Calculate the number of records to skip
    const shortlistedJobs = await appliedJobsCollection
      .find({
        applicantEmail: email,
        shortlist: "approved",
      })
      .skip(skip) // Skip the calculated number of records
      .limit(parseInt(limit)) // Limit the number of records returned
      .toArray();

    // Count total approved shortlisted jobs for pagination info
    const totalShortlistedJobs = await appliedJobsCollection.countDocuments({
      applicantEmail: email,
      shortlist: "approved",
    });

    if (shortlistedJobs.length === 0) {
      return res.status(404).json({
        message: "No approved shortlisted jobs found for this candidate",
      });
    }

    res.status(200).json({
      totalJobs: totalShortlistedJobs,
      totalPages: Math.ceil(totalShortlistedJobs / limit), // Calculate total pages
      currentPage: parseInt(page),
      jobs: shortlistedJobs, // Return the jobs
    });
  } catch (error) {
    console.error("Error fetching shortlisted jobs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// get selected jobs for candidates
exports.getSelectedJobs = async (req, res) => {
  const { email } = req.params;
  const { page = 1, limit = 12 } = req.query;

  try {
    const skip = (page - 1) * limit;
    const totalSelectedJobs = await appliedJobsCollection.countDocuments({
      applicantEmail: email,
      shortlist: "approved",
    });

    const selectedJobs = await appliedJobsCollection
      .find({
        applicantEmail: email,
        shortlist: "approved",
      })
      .skip(skip)
      .limit(parseInt(limit))
      .toArray();

    if (selectedJobs.length === 0) {
      return res.status(404).json({
        message: "No selected jobs found for this candidate",
      });
    }

    res.status(200).json({
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalSelectedJobs / limit),
      selectedJobs,
    });
  } catch (error) {
    console.error("Error fetching selected jobs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
