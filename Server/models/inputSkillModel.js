const mongoose = require("mongoose");

const inputSkillsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const InputSkills = mongoose.model("InputSkills", inputSkillsSchema);

module.exports = InputSkills;
