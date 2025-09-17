// controllers/openController.js
const mongoose = require("mongoose");
const Student = require("../models/student");
const Faculty = require("../models/faculty");
const Attendance = require("../models/attendance");
const Grade = require("../models/grade");
const Activity = require("../models/activity");
const Institute = require("../models/institute");
const Report = require("../models/report");

module.exports.getInstituteWiseStatsByAadhar = async (req, res) => {
  const { aadhar } = req.body;
  if (!aadhar) {
    return res
      .status(400)
      .json({ valid: false, message: "Aadhar number required" });
  }

  // find all student records with this aadhar (same person across institutes)
  const studentDocs = await Student.find({ aadhar })
    .select("institute regNumber name")
    .lean();
  if (!studentDocs || studentDocs.length === 0) {
    return res
      .status(404)
      .json({ valid: false, message: "No students found with this aadhar" });
  }

  // collect unique institute ids
  const instituteIdStrings = [
    ...new Set(studentDocs.map((s) => String(s.institute))),
  ];

  // compute stats per institute in parallel
  const institutesStats = await Promise.all(
    instituteIdStrings.map(async (instStr) => {
      const instituteId = new mongoose.Types.ObjectId(instStr);

      // basic info
      const [instituteInfo, totalStudents, totalFaculties] = await Promise.all([
        Institute.findById(instituteId).select("name code").lean(),
        Student.countDocuments({ institute: instituteId }),
        Faculty.countDocuments({ institute: instituteId }),
      ]);

      // attendance aggregate
      const attendanceAgg = await Attendance.aggregate([
        { $match: { institute: instituteId } },
        {
          $group: {
            _id: null,
            totalHeld: { $sum: "$totalHeld" },
            totalAttended: { $sum: "$totalAttended" },
          },
        },
      ]);

      let avgAttendance = "0.00";
      if (attendanceAgg.length > 0 && attendanceAgg[0].totalHeld > 0) {
        avgAttendance = (
          (attendanceAgg[0].totalAttended / attendanceAgg[0].totalHeld) *
          100
        ).toFixed(2);
      }

      // grade aggregate (avg CGPA)
      const gradeAgg = await Grade.aggregate([
        { $match: { institute: instituteId } },
        { $group: { _id: null, avgCGPA: { $avg: "$cgpa" } } },
      ]);
      const avgCGPA =
        gradeAgg.length > 0 && gradeAgg[0].avgCGPA !== null
          ? gradeAgg[0].avgCGPA.toFixed(2)
          : "—";

      // activity counts by status
      const activityAgg = await Activity.aggregate([
        { $match: { institute: instituteId } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]);

      const activityCounts = {
        total: 0,
        approved: 0,
        pending: 0,
        rejected: 0,
      };
      activityAgg.forEach((row) => {
        activityCounts.total += row.count;
        if (row._id === "Approved") activityCounts.approved = row.count;
        if (row._id === "Pending") activityCounts.pending = row.count;
        if (row._id === "Rejected") activityCounts.rejected = row.count;
      });

      return {
        institute: instituteInfo || { _id: instituteId },
        students: totalStudents,
        faculties: totalFaculties,
        academics: {
          avgAttendance,
          avgCGPA,
        },
        activities: activityCounts,
        // which student records matched this institute (helps front-end map)
        matchedStudents: studentDocs
          .filter((s) => String(s.institute) === instStr)
          .map((s) => ({ _id: s._id, name: s.name, regNumber: s.regNumber })),
      };
    })
  );

  return res.status(200).json({
    valid: true,
    message: "Institute-level stats fetched for given aadhar",
    aadhar,
    institutes: institutesStats,
  });
};

module.exports.getHomeData = async (req, res) => {
  const studentCount = await Student.countDocuments();
  const instituteCount = await Institute.countDocuments();
  const reportCount = await Report.countDocuments();

  res.status(200).json({
    valid: true,
    message: "Home data fetched successfully",
    data: {
      studentCount,
      instituteCount,
      reportCount,
    },
  });
};
