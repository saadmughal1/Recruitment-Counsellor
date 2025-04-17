const Skill = require("../models/skillModel");
const jwt = require("jsonwebtoken");

// Add Skill
const addSkill = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const userId = decoded.id;

  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Skill name is required" });
    }

    const newSkill = new Skill({
      user: userId,
      name,
    });

    const saved = await newSkill.save();

    res.status(201).json({
      message: "Skill added successfully",
      skill: saved,
    });
  } catch (error) {
    console.error("Add skill error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Skill
const deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const skill = await Skill.findById(id);

    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    await Skill.findByIdAndDelete(id);

    res.status(200).json({ message: "Skill deleted successfully" });
  } catch (error) {
    console.error("Delete skill error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update Skill
const updateSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = req.body;

    const skill = await Skill.findById(id);

    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    const updatedSkill = await Skill.findByIdAndUpdate(id, updateFields, {
      new: true,
    });

    res.status(200).json({
      message: "Skill updated successfully",
      skill: updatedSkill,
    });
  } catch (error) {
    console.error("Update skill error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get My Skills
const getMySkills = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const userId = decoded.id;

  try {
    const skills = await Skill.find({ user: userId });

    if (skills) {
      res.status(200).json({
        success: true,
        data: skills,
      });
    } else {
      res.status(200).json({
        success: false,
        data: [],
      });
    }
  } catch (error) {
    console.error("Error fetching skills:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch skills",
    });
  }
};

module.exports = {
  addSkill,
  deleteSkill,
  updateSkill,
  getMySkills,
};
