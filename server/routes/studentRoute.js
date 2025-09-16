const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const authenticate = require("../middleware/authenticate");
const { checkStudent } = require("../middleware/checkRole");
const wrapAsync = require("../utils/wrapAsync");

const {
  getDashboardData,
  getMyAcademics,
  getFacultyList,
  applyActivity,
  getMyActivities,
  getMyPortfolios,
  uploadPortfolioFile,
  getPortfolioById,
} = require("../controllers/studentController");

router.get(
  "/dashboard",
  authenticate,
  checkStudent,
  wrapAsync(getDashboardData)
);

// Single route to fetch student's attendance & grade
router.get("/academics", authenticate, checkStudent, wrapAsync(getMyAcademics));

router.get(
  "/faculty-list",
  authenticate,
  checkStudent, // usually only Admin can view all faculty
  wrapAsync(getFacultyList)
);

router.post(
  "/apply-activity",
  authenticate,
  checkStudent,
  upload.single("attachment"), // form field name = "attachment"
  wrapAsync(applyActivity)
);

router.get(
  "/my-activities",
  authenticate,
  checkStudent, // only students
  wrapAsync(getMyActivities)
);

// Upload student's portfolio
router.post(
  "/portfolio/upload",
  authenticate,
  checkStudent,
  upload.single("file"),
  wrapAsync(uploadPortfolioFile)
);

// Student list their own portfolios
router.get(
  "/portfolio/my",
  authenticate,
  checkStudent,
  wrapAsync(getMyPortfolios)
);

// Get portfolio by id (student/faculty/admin can view if same institute or owner)
// router.get("/portfolio/:id", authenticate, wrapAsync(getPortfolioById));

module.exports = router;
