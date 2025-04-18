require("dotenv").config();

const express = require("express");

const cors = require("cors");
const connectDB = require("./config/db");
const app = express();
const path = require("path");

const userRoutes = require("./routes/userRoutes");
const educationRoutes = require("./routes/educationRoutes");
const skillRoutes = require("./routes/skillRoutes");
const experienceRoutes = require("./routes/experienceRoutes");
const jobRoutes = require("./routes/jobRoutes");

connectDB();

app.use(cors());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is working");
});

app.use("/api/user", userRoutes);
app.use("/api/education", educationRoutes);
app.use("/api/skill", skillRoutes);
app.use("/api/experience", experienceRoutes);
app.use("/api/job", jobRoutes);

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
