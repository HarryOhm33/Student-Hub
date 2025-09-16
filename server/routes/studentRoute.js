const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const authenticate = require("../middleware/authenticate");
const { checkStudent } = require("../middleware/checkRole");
const wrapAsync = require("../utils/wrapAsync");

const {
  getMyAcademics,
  getFacultyList,
  applyActivity,
  getMyActivities,
} = require("../controllers/studentController");

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

module.exports = router;
