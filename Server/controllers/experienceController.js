const Experience = require("../models/experienceModel");
const jwt = require("jsonwebtoken");

const addExperience = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.id;

  try {
    const {
      position,
      company,
      location,
      startDate,
      endDate,
      current,
      description,
    } = req.body;

    if (!position || !company || !location || !startDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newExperience = new Experience({
      user: userId,
      position,
      company,
      location,
      startDate,
      endDate,
      current,
      description,
    });

    const saved = await newExperience.save();

    res.status(201).json({
      message: "Experience added successfully",
      experience: saved,
    });
  } catch (error) {
    console.error("Add experience error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteExperience = async (req, res) => {
  try {
    const { id } = req.params;
    const experience = await Experience.findById(id);

    if (!experience) {
      return res.status(404).json({ message: "Experience not found" });
    }

    await Experience.findByIdAndDelete(id);

    res.status(200).json({ message: "Experience deleted successfully" });
  } catch (error) {
    console.error("Delete experience error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateExperience = async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = req.body;

    const experience = await Experience.findById(id);

    if (!experience) {
      return res.status(404).json({ message: "Experience not found" });
    }

    const updatedExperience = await Experience.findByIdAndUpdate(
      id,
      updateFields,
      { new: true }
    );

    res.status(200).json({
      message: "Experience updated successfully",
      experience: updatedExperience,
    });
  } catch (error) {
    console.error("Update experience error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getMyExperience = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.id;

  try {
    const experiences = await Experience.find({ user: userId });

    res.status(200).json({
      success: true,
      data: experiences || [],
    });
  } catch (error) {
    console.error("Error fetching experience:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch experience records",
    });
  }
};

module.exports = {
  addExperience,
  deleteExperience,
  updateExperience,
  getMyExperience,
};
