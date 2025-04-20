require("dotenv").config();

const express = require("express");

const cors = require("cors");
const connectDB = require("./config/db");
const app = express();
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const userRoutes = require("./routes/userRoutes");
const educationRoutes = require("./routes/educationRoutes");
const skillRoutes = require("./routes/skillRoutes");
const experienceRoutes = require("./routes/experienceRoutes");
const jobRoutes = require("./routes/jobRoutes");
const messageRoutes = require("./routes/messageRoutes");
const inputSkills = require("./routes/inputSkills");


connectDB();

app.use(cors());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(`Socket ${socket.id} joined room: ${room}`);
  });

  socket.on("send_message", (data) => {
    // console.log(data);
    io.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.get("/", (req, res) => {
  res.send("API is working");
});

app.use("/api/user", userRoutes);
app.use("/api/education", educationRoutes);
app.use("/api/skill", skillRoutes);
app.use("/api/experience", experienceRoutes);
app.use("/api/job", jobRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/inputskills", inputSkills);
// http://localhost:4000/api/inputskills/add-input-skills


server.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
