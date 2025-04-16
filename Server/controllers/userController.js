const User = require("../models/userModel");

const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const fs = require("fs");
const path = require("path");

const register = async (req, res) => {
  const { fullname, email, role, password } = req.body;

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

    const newUser = new User({ fullname, email, password, role, profilePhoto });
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
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Server error, please try again later",
      error: err.message || "Unknown error",
    });
  }
};

const update = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    const { fullname, email } = req.body;

    const file = req.profilePhoto;

    const userId = decoded.id;

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(401)
        .json({ message: "User not found or not authenticated" });
    }

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const imgName = req.file.filename;

    const updatedUser = new User({
      email: email,
      fullname: fullname,
      profilePhoto: imgName,
    });

    await updatedUser.save();
    res
      .status(200)
      .json({ message: "User Updated successfully", data: updatedUser });
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
  update,
};
