const express = require("express");
const router = express.Router();
const {
  addApplicantJob,
  loadJobs,
  filteredJobs,
} = require("../controllers/applicantJobController");

router.post("/add-applicant-job", addApplicantJob);
router.get("/load-jobs", loadJobs);
router.get("/filtered-jobs/:jobId", filteredJobs);

module.exports = router;
