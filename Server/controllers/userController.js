const User = require("../models/userModel");
const Education = require("../models/educationModel");
const Experience = require("../models/experienceModel");
const Skill = require("../models/skillModel");

const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const fs = require("fs");
const path = require("path");

const register = async (req, res) => {
  const { fullname, email, role, password, companyName, companyDescription } =
    req.body;

  const profilePhoto = req.file?.filename;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (profilePhoto) {
        const filePath = path.join(__dirname, "../uploads", profilePhoto);
        fs.unlink(filePath, (err) => {
          if (err) console.error("Failed to delete file:", err);
        });
      }

      return res.status(400).json({ message: "Email already registered" });
    }

    const newUser = new User({
      fullname,
      email,
      password,
      role,
      profilePhoto,
      companyName,
      companyDescription,
    });
    await newUser.save();

    return res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);

    if (profilePhoto) {
      const filePath = path.join(__dirname, "../uploads", profilePhoto);
      fs.unlink(filePath, (err) => {
        if (err) console.error("Failed to delete file:", err);
      });
    }

    return res.status(500).json({
      message: "Server error, please try again later",
      error: err.message || "Unknown error",
    });
  }
};

const login = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const user = await User.findOne({ email, role });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, fullname: user.fullname },
      process.env.JWT_SECRET
    );

    return res.status(200).json({
      message: "Login successful",
      fullname: user.fullname,
      email: email,
      token,
      profilePhoto: user.profilePhoto || null,
      companyName: user.companyName || null,
      companyDescription: user.companyDescription || null,
      id: user._id,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Server error, please try again later",
      error: err.message || "Unknown error",
    });
  }
};

const applicantProfile = async (req, res) => {
  const { id } = req.params;
  try {
    const education = await Education.find({ user: id });
    const skill = await Skill.find({ user: id });
    const experience = await Experience.find({ user: id });
    const user = await User.findById({ _id: id });

    return res.status(200).json({
      status: 200,
      education: education || [],
      skill: skill || [],
      experience: experience || [],
      user: user || [],
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Server error, please try again later",
      error: err.message || "Unknown error",
    });
  }
};

const recruiterProfile = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById({ _id: id });
    return res.status(200).json({
      user: user || [],
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Server error, please try again later",
      error: err.message || "Unknown error",
    });
  }
};

module.exports = {
  register,
  login,
  applicantProfile,
  recruiterProfile,
};
