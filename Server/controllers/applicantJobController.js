const ApplicantJob = require("../models/applicantJobModel");
const Job = require("../models/JobModel");

const jwt = require("jsonwebtoken");

const addApplicantJob = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decoded.id;

    const { title, experienceRequired } = req.body;

    if (!title || !experienceRequired) {
      return res
        .status(400)
        .json({ message: "Applicant ID and Job ID are required." });
    }
    const newApplicantJob = new ApplicantJob({
      title: title,
      experienceRequired: experienceRequired,
      user: userId,
    });

    const saved = await newApplicantJob.save();

    res.status(201).json({
      message: "Applicant applied to job successfully.",
      data: saved,
    });
  } catch (error) {
    console.error("Error in addApplicantJob:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const loadJobs = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decoded.id;

    const jobs = await ApplicantJob.find({ user: userId });

    if (!jobs || jobs.length === 0) {
      return res.status(404).json({ message: "No jobs found for this user." });
    }

    res.status(200).json({
      message: "Jobs loaded successfully.",
      data: jobs,
    });
  } catch (error) {
    console.error("Error in loadJobs:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const filteredJobs = async (req, res) => {
  const jobId = req.params.jobId;

  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Fetch the applicant's job titles and required experience
    const applicantJobs = await ApplicantJob.find({ _id: jobId });

    if (!applicantJobs || applicantJobs.length === 0) {
      return res
        .status(404)
        .json({ message: "No applicant jobs found for user." });
    }

    const filters = applicantJobs.map((job) => ({
      title: { $regex: new RegExp(`^${job.title.toLowerCase()}$`, "i") },
      experienceRequired: { $lte: job.experienceRequired },
    }));

    let matchedJobs = await Job.find({
      $or: filters,
      isActive: true,
    }).lean(); // Converts documents to plain JS objects

    // Add `recruiter` field using `user`
    matchedJobs = matchedJobs.map((job) => ({
      ...job,
      recruiter: job.user,
    }));

    return res.status(200).json({
      message:
        matchedJobs.length > 0
          ? "Filtered jobs fetched successfully."
          : "No Filtered jobs found.",
      data: matchedJobs,
    });
  } catch (error) {
    console.error("Error in filteredJobs:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  addApplicantJob,
  loadJobs,
  filteredJobs,
};
