const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");

const {
  getInstituteWiseStatsByAadhar,
  getHomeData,
} = require("../controllers/openController");

router.post("/institute-stats", wrapAsync(getInstituteWiseStatsByAadhar));

router.get("/home-data", wrapAsync(getHomeData));

module.exports = router;
