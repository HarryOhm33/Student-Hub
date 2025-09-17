// controllers/adminController.js
const mongoose = require("mongoose");
const Admin = require("../models/admin");
const Institute = require("../models/institute");
const Faculty = require("../models/faculty");
const Student = require("../models/student");
const Attendance = require("../models/attendance");
const Grade = require("../models/grade");
const Activity = require("../models/activity");
const bcrypt = require("bcryptjs");
const sendEmail = require("../utils/sendEmail");
const {
  generateFacultyWelcomeEmail,
  generateStudentWelcomeEmail,
} = require("../utils/mailTemplates");
const cloudinary = require("../config/coudinary");
const Report = require("../models/report");

// ================== Get Admin Dashboard ==================
module.exports.getAdminDashboard = async (req, res) => {
  const instituteId = req.user.institute;
  // console.log(instituteId);

  // Total counts
  const totalStudents = await Student.countDocuments({
    institute: instituteId,
  });
  const totalFaculties = await Faculty.countDocuments({
    institute: instituteId,
  });

  // Attendance Summary
  // Step 1: Find all documents for the specific instituteId
  const attendances = await Attendance.find({ institute: instituteId });

  // Step 2: Use reduce to get the total stats
  const attendanceStats = attendances.reduce(
    (accumulator, current) => {
      accumulator.totalHeld += current.totalHeld;
      accumulator.totalAttended += current.totalAttended;
      return accumulator;
    },
    { totalHeld: 0, totalAttended: 0 }
  );

  // console.log(attendanceStats); // Output will be an object: { totalHeld: ..., totalAttended: ... }

  let avgAttendance = "0.00";

  // Step 3: Check the properties of the attendanceStats object to calculate average
  if (attendanceStats.totalHeld > 0) {
    avgAttendance = (
      (attendanceStats.totalAttended / attendanceStats.totalHeld) *
      100
    ).toFixed(2);
  }

  // console.log(avgAttendance);

  // Grades Summary

  // Step 1: Find all documents for the specific instituteId
  const grades = await Grade.find({ institute: instituteId });

  // Step 2: Use reduce to calculate the sum of CGPA and the count
  const gradeStats = grades.reduce(
    (accumulator, current) => {
      // We only want to include valid numbers in our calculation
      if (typeof current.cgpa === "number" && !isNaN(current.cgpa)) {
        accumulator.totalCGPA += current.cgpa;
        accumulator.count++;
      }
      return accumulator;
    },
    { totalCGPA: 0, count: 0 }
  );

  let avgCGPA = "—";

  // Step 3: Calculate the average CGPA based on the reduced stats
  if (gradeStats.count > 0) {
    avgCGPA = (gradeStats.totalCGPA / gradeStats.count).toFixed(2);
  }

  // console.log(avgCGPA);

  // Activities Summary
  const activities = await Activity.find({ institute: instituteId });
  const totalActivities = activities.length;
  const approvedActivities = activities.filter(
    (a) => a.status === "Approved"
  ).length;
  const pendingActivities = activities.filter(
    (a) => a.status === "Pending"
  ).length;
  const rejectedActivities = activities.filter(
    (a) => a.status === "Rejected"
  ).length;

  // Response
  res.status(200).json({
    valid: true,
    message: "Admin dashboard data fetched successfully",
    data: {
      students: totalStudents,
      faculties: totalFaculties,
      academics: {
        avgAttendance,
        avgCGPA,
      },
      activities: {
        total: totalActivities,
        approved: approvedActivities,
        pending: pendingActivities,
        rejected: rejectedActivities,
      },
    },
  });
};

// Get Institute Details
module.exports.getInstituteDetails = async (req, res) => {
  // find admin with institute reference
  const admin = await Admin.findById(req.user._id).populate("institute"); // if you renamed field to institute, adjust
  if (!admin) {
    return res.status(404).json({ message: "Admin not found" });
  }

  // fetch institute info
  const institute = await Institute.findById(admin.institute);
  if (!institute) {
    return res.status(404).json({ message: "Institute not found" });
  }

  res.status(200).json({
    valid: true,
    message: "Dashboard data fetched successfully",
    institute,
  });
};

module.exports.addDepartment = async (req, res) => {
  const { departmentCode, departmentName } = req.body;
  const admin = await Admin.findById(req.user._id);

  const institute = await Institute.findById(admin.institute);

  department = {
    name: departmentName,
    code: departmentCode,
  };

  institute.departments.push(department);
  await institute.save();

  res.status(200).json({
    valid: true,
    message: "Department added successfully",
    institute,
  });
};

module.exports.addCourse = async (req, res) => {
  const { courseCode, courseName } = req.body;

  // Find the admin making the request
  const admin = await Admin.findById(req.user._id);

  // Find the institute of the admin
  const institute = await Institute.findById(admin.institute);

  // Create new course object
  const course = {
    name: courseName,
    code: courseCode,
  };

  // Add course to institute's courses array
  institute.courses.push(course);
  await institute.save();

  res.status(200).json({
    valid: true,
    message: "Course added successfully",
    institute,
  });
};

module.exports.addFaculty = async (req, res) => {
  const { name, email, password, departmentName, designation } = req.body;

  const existingFaculty = await Faculty.findOne({
    email,
    institute: req.user.institute,
  });

  if (existingFaculty) {
    return res.status(400).json({ message: "Faculty already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // get department code
  const departmentCode = await Institute.findById(req.user.institute).then(
    (institute) => {
      const department = institute.departments.find(
        (dept) => dept.name === departmentName
      );
      if (!department) {
        return null;
      }
      return department.code;
    }
  );

  if (!departmentCode) {
    return res.status(400).json({ message: "Department not found" });
  }

  // Generate Employee ID
  const inst = await Institute.findById(req.user.institute);
  const instCode = inst.code.substring(0, 3).toUpperCase();
  const randomNum = Math.floor(1000 + Math.random() * 9000); // 4-digit random
  const employeeId = `EMP${instCode}${departmentCode}${randomNum}`;

  const faculty = await Faculty.create({
    name,
    email,
    password: hashedPassword,
    department: departmentName,
    designation,
    institute: req.user.institute,
    employeeId,
  });

  const htmlContent = generateFacultyWelcomeEmail(
    name,
    employeeId,
    password,
    departmentName,
    designation
  );

  await sendEmail(email, "Verify Your Account", {
    text: "Welcome to the Institute!",
    html: htmlContent,
  });

  res.status(200).json({
    valid: true,
    message: "Faculty added successfully",
    faculty,
  });
};

module.exports.getFacultyList = async (req, res) => {
  // Fetch all faculties of the institute
  const faculties = await Faculty.find({
    institute: req.user.institute,
  }).select(
    "-password" // Exclude password from the response
  );

  if (!faculties || faculties.length === 0) {
    return res.status(404).json({ message: "No faculty found" });
  }

  res.status(200).json({
    valid: true,
    message: "Faculty list fetched successfully",
    faculties,
  });
};

module.exports.addStudent = async (req, res) => {
  const {
    name,
    email,
    password,
    regNumber,
    departmentName,
    courseName,
    year,
    aadhar,
  } = req.body;

  // console.log(req.body);

  // Check if student already exists
  const existingStudent = await Student.findOne({
    email,
    institute: req.user.institute,
  });

  if (existingStudent) {
    return res.status(400).json({ message: "Student already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Get department code
  const departmentCode = await Institute.findById(req.user.institute).then(
    (institute) => {
      const department = institute.departments.find(
        (dept) => dept.name === departmentName
      );
      if (!department) return null;
      return department.code;
    }
  );

  if (!departmentCode) {
    return res.status(400).json({ message: "Department not found" });
  }

  const courseCode = await Institute.findById(req.user.institute).then(
    (institute) => {
      const course = institute.courses.find((c) => c.name === courseName);
      if (!course) return null;
      return course.code;
    }
  );

  if (!courseCode) {
    return res.status(400).json({ message: "Course not found" });
  }

  const student = await Student.create({
    name,
    email,
    password: hashedPassword,
    department: departmentName,
    course: courseName,
    year,
    institute: req.user.institute,
    regNumber,
    aadhar,
  });

  const htmlContent = generateStudentWelcomeEmail(
    name,
    regNumber,
    password,
    departmentName,
    courseName,
    year
  );

  await sendEmail(email, "Verify Your Account", {
    text: "Welcome to the Institute!",
    html: htmlContent,
  });

  res.status(200).json({
    valid: true,
    message: "Student added successfully",
    student,
  });
};

module.exports.getStudentList = async (req, res) => {
  const students = await Student.find({ institute: req.user.institute }).select(
    "-password"
  );

  if (!students || students.length === 0) {
    return res.status(404).json({ message: "No students found" });
  }

  res.status(200).json({
    valid: true,
    message: "Student list fetched successfully",
    students,
  });
};

// ================== Upload Report ==================
module.exports.uploadReport = async (req, res) => {
  const { title, description, type } = req.body;
  const instituteId = req.user.institute._id;

  if (!req.file) {
    return res.status(400).json({ valid: false, message: "No file uploaded" });
  }

  // Upload file buffer to Cloudinary as raw (for PDF/docx/etc.)
  const uploadResult = await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "institute-portfolios",
        resource_type: "raw", // ✅ ensures proper MIME for PDF
        public_id: `${instituteId}_${Date.now()}`,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(req.file.buffer);
  });

  // save to DB
  const report = await Report.create({
    institute: req.user.institute,
    uploadedBy: req.user._id,
    title,
    description,
    type,
    fileUrl: uploadResult.secure_url, // works for open/download
    publicId: uploadResult.public_id,
  });

  res.status(200).json({
    valid: true,
    message: "Report uploaded successfully",
    report,
  });
};

// ================== Get My Reports ==================
module.exports.getMyReports = async (req, res) => {
  const reports = await Report.find({ institute: req.user.institute })
    .populate("uploadedBy", "name email")
    .sort({ createdAt: -1 });

  res.status(200).json({
    valid: true,
    message: "Reports fetched successfully",
    reports,
  });
};
