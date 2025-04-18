const Job = require("../models/JobModel");
const jwt = require("jsonwebtoken");

// Add Job
const addJob = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.id;

  try {
    const { title, description, location, experienceRequired, skillsRequired } =
      req.body;

    if (!title || !description || !location || !skillsRequired) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newJob = new Job({
      title,
      description,
      location,
      experienceRequired,
      skillsRequired,
      user: userId,
    });

    const saved = await newJob.save();

    res.status(201).json({
      message: "Job posted successfully",
      job: saved,
    });
  } catch (error) {
    console.error("Add job error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Job
const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    await Job.findByIdAndDelete(id);

    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Delete job error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update Job
const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      location,
      experienceRequired,
      skillsRequired,
      isActive,
    } = req.body;

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const updateFields = {};
    if (title !== undefined) updateFields.title = title;
    if (description !== undefined) updateFields.description = description;
    if (location !== undefined) updateFields.location = location;
    if (experienceRequired !== undefined)
      updateFields.experienceRequired = experienceRequired;
    if (skillsRequired !== undefined)
      updateFields.skillsRequired = skillsRequired;
    if (isActive !== undefined) updateFields.isActive = isActive;

    const updatedJob = await Job.findByIdAndUpdate(id, updateFields, {
      new: true,
    });

    res.status(200).json({
      message: "Job updated successfully",
      job: updatedJob,
    });
  } catch (error) {
    console.error("Update job error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get My Jobs
const getMyPostedJobs = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.id;

  try {
    const jobs = await Job.find({ user: userId });

    res.status(200).json({
      success: true,
      data: jobs,
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch jobs",
    });
  }
};

// Get single job
const getSingleJob = async (req, res) => {
  const { id } = req.params;
  try {
    const jobs = await Job.findById(id);
    res.status(200).json({
      success: true,
      data: jobs,
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch jobs",
    });
  }
};

module.exports = {
  addJob,
  deleteJob,
  updateJob,
  getMyPostedJobs,
  getSingleJob,
};
