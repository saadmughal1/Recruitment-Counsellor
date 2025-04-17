const Education = require("../models/educationModel");
const jwt = require("jsonwebtoken");

const addEducation = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const userId = decoded.id;

  try {
    const {
      institution,
      degree,
      fieldOfStudy,
      startDate,
      endDate,
      description,
    } = req.body;

    if (!institution || !degree || !fieldOfStudy || !startDate || !endDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newEducation = new Education({
      user: userId,
      institution,
      degree,
      fieldOfStudy,
      startDate,
      endDate,
      description,
    });

    const saved = await newEducation.save();

    res
      .status(201)
      .json({ message: "Education added successfully", education: saved });
  } catch (error) {
    console.error("Add education error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteEducation = async (req, res) => {
  try {
    const { id } = req.params;

    const education = await Education.findById(id);

    if (!education) {
      return res.status(404).json({ message: "Education not found" });
    }

    await Education.findByIdAndDelete(id);

    res.status(200).json({ message: "Education deleted successfully" });
  } catch (error) {
    console.error("Delete education error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateEducation = async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = req.body;

    const education = await Education.findById(id);

    if (!education) {
      return res.status(404).json({ message: "Education not found" });
    }

    const updatedEducation = await Education.findByIdAndUpdate(
      id,
      updateFields,
      {
        new: true,
      }
    );

    res.status(200).json({
      message: "Education updated successfully",
      education: updatedEducation,
    });
  } catch (error) {
    console.error("Update education error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getMyEducation = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const userId = decoded.id;

  try {
    const educationRecords = await Education.find({ user: userId });
    if (educationRecords) {
      res.status(200).json({
        success: true,
        data: educationRecords,
      });
    } else {
      res.status(200).json({
        success: false,
        data: [],
      });
    }
  } catch (error) {
    console.error("Error fetching education:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch education records",
    });
  }
};

module.exports = {
  addEducation,
  deleteEducation,
  updateEducation,
  getMyEducation,
};
