const express = require("express");
const router = express.Router();
const {
  addSkill,
  deleteSkill,
  updateSkill,
  getMySkills,
} = require("../controllers/skillController");
const authMiddleware = require("../middleware/authMiddleware");

// Routes
router.get("/", getMySkills);
router.post("/add", addSkill);
router.put("/update/:id", updateSkill);
router.delete("/delete/:id", deleteSkill);

module.exports = router;
