const express = require("express");
const router = express.Router();
const {
  addApplicantJob,
  loadJobs,
} = require("../controllers/applicantJobController");

router.post("/add-applicant-job", addApplicantJob);
router.get("/load-jobs", loadJobs);

module.exports = router;
