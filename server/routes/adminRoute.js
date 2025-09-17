const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const wrapAsync = require("../utils/wrapAsync");
const authenticate = require("../middleware/authenticate");

const {
  getAdminDashboard,
  getInstituteDetails,
  addDepartment,
  addCourse,
  addFaculty,
  getFacultyList,
  addStudent,
  getStudentList,
  uploadReport,
  getMyReports,
} = require("../controllers/adminController");
const { checkAdmin } = require("../middleware/checkRole");

router.get(
  "/dashboard",
  authenticate,
  checkAdmin,
  wrapAsync(getAdminDashboard)
);

router.get(
  "/institute-details",
  authenticate,
  checkAdmin,
  wrapAsync(getInstituteDetails)
);

router.post(
  "/add-department",
  authenticate,
  checkAdmin,
  wrapAsync(addDepartment)
);

router.post("/add-course", authenticate, checkAdmin, wrapAsync(addCourse));

router.post("/add-faculty", authenticate, checkAdmin, wrapAsync(addFaculty));

router.get(
  "/faculty-list",
  authenticate,
  checkAdmin,
  wrapAsync(getFacultyList)
);

router.post("/add-student", authenticate, checkAdmin, wrapAsync(addStudent));

router.get(
  "/student-list",
  authenticate,
  checkAdmin,
  wrapAsync(getStudentList)
);

// Upload a report
router.post(
  "/reports/upload",
  authenticate,
  checkAdmin,
  upload.single("file"), // frontend should send form-data with "file"
  wrapAsync(uploadReport)
);

// Get all reports of institute
router.get("/reports/my", authenticate, checkAdmin, wrapAsync(getMyReports));

module.exports = router;
