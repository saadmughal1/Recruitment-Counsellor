const ApplicantJob = require("../models/applicantJobModel");

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

module.exports = {
  addApplicantJob,
  loadJobs,
};
