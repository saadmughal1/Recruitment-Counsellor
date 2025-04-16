const User = require("../models/userModel");

const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const { fullname, email, role, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const newUser = new User({ fullname, email, password, role });
    await newUser.save();

    return res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
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
};
