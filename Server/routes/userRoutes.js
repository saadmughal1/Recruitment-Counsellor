const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs")
const { register, login, update } = require("../controllers/userController");

const uploadPath = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

router.get("/", (req, res) => {
  res.send("API is working");
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, uniqueSuffix + extension);
  },
});

const upload = multer({ storage });

router.post("/register", upload.single("profilePhoto"), register);




router.post("/login", login);
router.post("/update", upload.single("profilePhoto"), update);

module.exports = router;
