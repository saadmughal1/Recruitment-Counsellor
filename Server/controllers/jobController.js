const Job = require("../models/JobModel");
const Skill = require("../models/skillModel");
const Experience = require("../models/experienceModel");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const mongoose = require("mongoose");

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

// get job matched applicants
const matchedApplicants = async (req, res) => {
  const { id: jobId } = req.params;

  try {
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    const requiredSkills = job.skillsRequired.map((s) => s.toLowerCase());

    const applicants = await User.aggregate([
      { $match: { role: "applicant" } },

      {
        $lookup: {
          from: "skills",
          localField: "_id",
          foreignField: "user",
          as: "skills",
        },
      },
      {
        $lookup: {
          from: "experiences",
          localField: "_id",
          foreignField: "user",
          as: "experiences",
        },
      },
      {
        $addFields: {
          userSkills: {
            $map: {
              input: "$skills",
              as: "skill",
              in: { $toLower: "$$skill.name" },
            },
          },
        },
      },
      {
        $addFields: {
          matchedSkills: {
            $setIntersection: ["$userSkills", requiredSkills],
          },
        },
      },
      {
        $match: {
          $expr: {
            $gt: [{ $size: "$matchedSkills" }, 0],
          },
        },
      },
      {
        $addFields: {
          experienceMonths: {
            $sum: {
              $map: {
                input: "$experiences",
                as: "exp",
                in: {
                  $divide: [
                    {
                      $subtract: [
                        {
                          $ifNull: [
                            {
                              $cond: [
                                { $eq: ["$$exp.current", true] },
                                new Date(),
                                "$$exp.endDate",
                              ],
                            },
                            new Date(),
                          ],
                        },
                        "$$exp.startDate",
                      ],
                    },
                    1000 * 60 * 60 * 24 * 30,
                  ],
                },
              },
            },
          },
        },
      },
      {
        $addFields: {
          totalExperienceYears: {
            $round: [{ $divide: ["$experienceMonths", 12] }, 1],
          },
        },
      },
      {
        $match: {
          $expr: {
            $gte: ["$totalExperienceYears", job.experienceRequired],
          },
        },
      },
      {
        $project: {
          fullname: 1,
          email: 1,
          profilePhoto: 1,
          userSkills: 1,
          matchedSkills: 1,
          requiredSkills: {
            $literal: requiredSkills,
          },
          totalExperienceYears: 1,
          requiredExperienceYears: {
            $literal: job.experienceRequired,
          },
          experiences: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      message: "Matched applicants fetched successfully",
      data: applicants,
    });
  } catch (error) {
    console.error("Error fetching applicants:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch applicants",
      error: error.message,
    });
  }
};

// get job matched jobs
const getMatchedJobs = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.id;

  try {
    // 1. Get user's skills and experiences
    const userSkills = await Skill.find({ user: userId }).lean();
    const userExperiences = await Experience.find({ user: userId }).lean();

    const skillNames = userSkills.map((s) => s.name.toLowerCase());

    // 2. Get all active jobs and populate recruiter
    const allJobs = await Job.find({ isActive: true })
      .populate("user", "_id fullname email") // 'user' is the recruiter field
      .lean();

    const matchedJobs = allJobs.filter((job) => {
      const jobSkills = job.skillsRequired.map((s) => s.toLowerCase());

      // Match skills
      const matchedSkills = skillNames.filter((s) => jobSkills.includes(s));
      if (matchedSkills.length === 0) return false;

      // Match experience
      let totalExperienceMonths = 0;

      userExperiences.forEach((exp) => {
        if (Array.isArray(exp.skills) && exp.skills.length > 0) {
          const expSkills = exp.skills.map((s) => s.toLowerCase());
          const hasMatch = expSkills.some((s) => jobSkills.includes(s));
          if (!hasMatch) return;
        }

        const start = new Date(exp.startDate);
        const end = exp.current ? new Date() : new Date(exp.endDate);
        if (isNaN(start) || isNaN(end)) return;

        const months =
          (end.getFullYear() - start.getFullYear()) * 12 +
          (end.getMonth() - start.getMonth());

        totalExperienceMonths += months;
      });

      const totalExperienceYears = totalExperienceMonths / 12;

      return totalExperienceYears >= (job.experienceRequired || 0);
    });

    // 3. Return matched jobs and include recruiter ID/info
    const responseJobs = matchedJobs.map((job) => ({
      _id: job._id,
      title: job.title,
      description: job.description,
      experienceRequired: job.experienceRequired,
      skillsRequired: job.skillsRequired,
      recruiter: job.user?._id || job.user, // recruiter ID
      recruiterInfo: job.user || null, // full recruiter object if populated
      isActive: job.isActive,
    }));

    res.status(200).json({
      success: true,
      message: "Matched jobs fetched successfully",
      data: responseJobs,
    });
  } catch (error) {
    console.error("Error fetching matched jobs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch matched jobs",
      error: error.message,
    });
  }
};

module.exports = {
  addJob,
  deleteJob,
  updateJob,
  getMyPostedJobs,
  getSingleJob,
  matchedApplicants,
  getMatchedJobs,
};
