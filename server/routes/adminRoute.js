const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync");
const authenticate = require("../middleware/authenticate");

const {
  getInstituteDetails,
  addDepartment,
  addCourse,
  addFaculty,
  getFacultyList,
  addStudent,
  getStudentList,
} = require("../controllers/adminController");
const { checkAdmin } = require("../middleware/checkRole");

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

module.exports = router;
