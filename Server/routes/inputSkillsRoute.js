const express = require("express");
const router = express.Router();
const {
  addInputSkills,
  getInputSkills
} = require("../controllers/inputSkillsController");

// Routes
router.get("/add-input-skills", addInputSkills);
router.get("/get-input-skills", getInputSkills);

module.exports = router;
