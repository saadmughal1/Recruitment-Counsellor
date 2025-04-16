const express = require("express");
const router = express.Router();

const {
  addEducation,
  deleteEducation,
  updateEducation,
  getMyEducation,
} = require("../controllers/educationController");

const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, getMyEducation);
router.post("/add", authMiddleware, addEducation);
router.delete("/delete/:id", deleteEducation);
router.put("/update/:id", updateEducation);

module.exports = router;
