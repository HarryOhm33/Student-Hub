// controllers/adminController.js
const Admin = require("../models/admin");
const Institute = require("../models/institute");
const Faculty = require("../models/faculty");
const Student = require("../models/student");
const bcrypt = require("bcryptjs");
const sendEmail = require("../utils/sendEmail");
const {
  generateFacultyWelcomeEmail,
  generateStudentWelcomeEmail,
} = require("../utils/mailTemplates");

// ✅ GET Dashboard Data
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
