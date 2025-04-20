const express = require("express");
const router = express.Router();
const {
  addInputSkills,
} = require("../controllers/inputSkillsController");

// Routes
router.get("/add-input-skills", addInputSkills);

module.exports = router;
