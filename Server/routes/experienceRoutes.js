const express = require("express");
const router = express.Router();

const {
  addExperience,
  deleteExperience,
  updateExperience,
  getMyExperience,
} = require("../controllers/experienceController");


router.get("/", getMyExperience);
router.post("/add", addExperience);
router.delete("/delete/:id", deleteExperience);
router.put("/update/:id", updateExperience);

module.exports = router;
