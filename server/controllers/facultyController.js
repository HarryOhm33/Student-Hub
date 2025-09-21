const Student = require("../models/student");
const Attendance = require("../models/attendance");
const Grade = require("../models/grade");
const Activity = require("../models/activity");

//================== GET DashBoard Data ==============

module.exports.getFacultyDashboard = async (req, res) => {
  const facultyId = req.user._id;
  const instituteId = req.user.institute;

  // 1. Students taught by this faculty (from Attendance & Grade records)
  //   const studentIdsFromAttendance = await Attendance.distinct("student", {
  //     faculty: facultyId,
  //     institute: instituteId,
  //   });

  //   const studentIdsFromGrades = await Grade.distinct("student", {
  //     faculty: facultyId,
  //     institute: instituteId,
  //   });

  //   const uniqueStudentIds = [
  //     ...new Set([...studentIdsFromAttendance, ...studentIdsFromGrades]),
  //   ];
  //   const totalStudents = uniqueStudentIds.length;

  const totalStudents = await Student.countDocuments({
    institute: instituteId,
  });

  // 2. Attendance Summary
  const attendances = await Attendance.find({
    faculty: facultyId,
    institute: instituteId,
  });

  const attendanceStats = attendances.reduce(
    (accumulator, current) => {
      accumulator.totalHeld += current.totalHeld;
      accumulator.totalAttended += current.totalAttended;
      return accumulator;
    },
    { totalHeld: 0, totalAttended: 0 }
  );

  let avgAttendance = 0;
  if (attendanceStats.totalHeld > 0) {
    avgAttendance =
      (attendanceStats.totalAttended / attendanceStats.totalHeld) * 100;
  }

  // 3. Grades Summary
  const grades = await Grade.find({
    faculty: facultyId,
    institute: instituteId,
  });

  const gradeStats = grades.reduce(
    (accumulator, current) => {
      // Only consider valid numbers for the average
      if (typeof current.cgpa === "number" && !isNaN(current.cgpa)) {
        accumulator.totalCGPA += current.cgpa;
        accumulator.count++;
      }
      return accumulator;
    },
    { totalCGPA: 0, count: 0 }
  );

  const avgCGPA =
    gradeStats.count > 0 ? gradeStats.totalCGPA / gradeStats.count : null;

  // 4. Activities handled by this faculty
  const activities = await Activity.find({
    faculty: facultyId,
    institute: instituteId,
  });
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

  res.status(200).json({
    valid: true,
    message: "Faculty dashboard data fetched successfully",
    data: {
      students: totalStudents,
      academics: {
        avgAttendance: avgAttendance.toFixed(2),
        avgCGPA: avgCGPA ? avgCGPA.toFixed(2) : "—",
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

// ================== Get Student List ==================
module.exports.getStudentList = async (req, res) => {
  const students = await Student.find({ institute: req.user.institute })
    .select("-password")
    .populate("institute");

  if (!students || students.length === 0) {
    return res.status(404).json({ message: "No students found" });
  }

  res.status(200).json({
    valid: true,
    message: "Student list fetched successfully",
    students,
  });
};

// ================== Get Student By ID ==================
module.exports.getStudentById = async (req, res) => {
  const { studentId } = req.body;

  const student = await Student.findById(studentId).select("-password");
  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  const attendance = await Attendance.findOne({ student: student._id });
  const grade = await Grade.findOne({ student: student._id });

  const activities = await Activity.find({
    student: student._id,
    status: "Approved",
  }).select(
    "title description credentialId activityType attachmentLink isIssuerVerificationRequired isIssuerVerified remarks createdAt"
  );

  res.status(200).json({
    valid: true,
    student,
    attendance,
    grade,
    approvedActivities: activities,
  });
};

// ================== Add Grade ==================
module.exports.addGrade = async (req, res) => {
  const { studentId, cgpa } = req.body;

  let grade = await Grade.findOne({ student: studentId });

  if (grade) {
    // update if already exists
    grade.cgpa = cgpa;
    await grade.save();
  } else {
    // create new grade record
    grade = await Grade.create({
      student: studentId,
      faculty: req.user._id,
      institute: req.user.institute,
      cgpa,
    });
  }

  res.status(200).json({
    valid: true,
    message: "Grade saved successfully",
    grade,
  });
};

// ================== Add Attendance ==================
module.exports.addAttendance = async (req, res) => {
  const { studentId, totalHeld, totalAttended } = req.body;

  let attendance = await Attendance.findOne({
    student: studentId,
  });

  if (attendance) {
    // update existing record
    attendance.totalHeld = totalHeld;
    attendance.totalAttended = totalAttended;
    await attendance.save();
  } else {
    // create new record
    attendance = await Attendance.create({
      student: studentId,
      faculty: req.user._id,
      institute: req.user.institute,
      totalHeld,
      totalAttended,
    });
  }

  res.status(200).json({
    valid: true,
    message: "Attendance saved successfully",
    attendance,
  });
};

// ================== Faculty: Get All Assigned Activities ==================
module.exports.getFacultyActivities = async (req, res) => {
  const activities = await Activity.find({ faculty: req.user._id })
    .populate("student", "name regNumber email") // show student info
    .sort({ createdAt: -1 }); // latest first

  if (!activities || activities.length === 0) {
    return res
      .status(404)
      .json({ message: "No activity requests found for you" });
  }

  res.status(200).json({
    valid: true,
    message: "Your assigned activities fetched successfully",
    activities,
  });
};

// ================== Faculty: Validate Activity ==================
module.exports.validateActivity = async (req, res) => {
  const { activityId, status, remarks } = req.body;

  // Ensure only assigned faculty can validate
  const activity = await Activity.findOne({
    _id: activityId,
    faculty: req.user._id, // only that faculty can approve/reject
  });

  if (!activity) {
    return res
      .status(404)
      .json({ message: "Activity not found or not assigned to you" });
  }

  // Update status + remarks
  activity.status = status; // "Approved" or "Rejected"
  activity.remarks = remarks;
  await activity.save();

  res.status(200).json({
    valid: true,
    message: `Activity ${status.toLowerCase()} successfully`,
    activity,
  });
};
