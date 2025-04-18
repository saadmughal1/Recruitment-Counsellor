const express = require("express");
const router = express.Router();
const {
  addJob,
  deleteJob,
  updateJob,
  getMyPostedJobs,
  getSingleJob,
} = require("../controllers/jobController");

router.get("/getMyPostedJobs", getMyPostedJobs);
router.get("/getSingleJob/:id",getSingleJob);

router.post("/add", addJob);
router.put("/update/:id", updateJob);
router.delete("/delete/:id", deleteJob);

module.exports = router;
