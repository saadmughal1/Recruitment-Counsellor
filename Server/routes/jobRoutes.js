const express = require("express");
const router = express.Router();
const {
  addJob,
  deleteJob,
  updateJob,
  getMyPostedJobs,
  getSingleJob,
  matchedApplicants,
  getMatchedJobs
} = require("../controllers/jobController");

router.get("/getMyPostedJobs", getMyPostedJobs);
router.get("/getSingleJob/:id", getSingleJob);

router.post("/add", addJob);
router.put("/update/:id", updateJob);
router.delete("/delete/:id", deleteJob);

router.get("/matchedApplicants/:id", matchedApplicants);




router.get("/matchedJobs", getMatchedJobs);

module.exports = router;
