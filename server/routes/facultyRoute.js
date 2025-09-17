const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/authenticate");
const { checkFaculty } = require("../middleware/checkRole");
const wrapAsync = require("../utils/wrapAsync");

const {
  getFacultyDashboard,
  getStudentList,
  getStudentById,
  addGrade,
  addAttendance,
  getFacultyActivities,
  validateActivity,
} = require("../controllers/facultyController");

// ================= Routes =================

// GEt Dashboard Data

router.get(
  "/dashboard",
  authenticate,
  checkFaculty,
  wrapAsync(getFacultyDashboard)
);

// Get all students of faculty's institute
router.get("/students", authenticate, checkFaculty, wrapAsync(getStudentList));

// Get a specific student (with attendance + grade)
router.post("/student", authenticate, checkFaculty, wrapAsync(getStudentById));

// Add/Update grade for a student
router.post("/student/grade", authenticate, checkFaculty, wrapAsync(addGrade));

// Add/Update attendance for a student
router.post(
  "/student/attendance",
  authenticate,
  checkFaculty,
  wrapAsync(addAttendance)
);

// Get All Activities
router.get(
  "/activities",
  authenticate,
  checkFaculty,
  wrapAsync(getFacultyActivities)
);

// Validate Activity
router.post(
  "/validate-activity",
  authenticate,
  checkFaculty,
  wrapAsync(validateActivity)
);

module.exports = router;
