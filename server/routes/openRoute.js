const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");

const {
  getInstituteWiseStatsByAadhar,
  getHomeData,
  verifyIssuerApproval,
  getIssuerApprovalSession,
} = require("../controllers/openController");

router.post("/institute-stats", wrapAsync(getInstituteWiseStatsByAadhar));

router.get("/home-data", wrapAsync(getHomeData));

router.post("/issuer/get-session-info", wrapAsync(getIssuerApprovalSession));

router.post("/issuer/approve", wrapAsync(verifyIssuerApproval));

module.exports = router;
