const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");

const {
  getInstituteWiseStatsByAadhar,
} = require("../controllers/openController");

router.post("/institute-stats", wrapAsync(getInstituteWiseStatsByAadhar));

module.exports = router;
