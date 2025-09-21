// controllers/openController.js
const mongoose = require("mongoose");
const Student = require("../models/student");
const Faculty = require("../models/faculty");
const Attendance = require("../models/attendance");
const Grade = require("../models/grade");
const Activity = require("../models/activity");
const Institute = require("../models/institute");
const Report = require("../models/report");
const IssuerApprovalSession = require("../models/issuerApprovalSession");

module.exports.getInstituteWiseStatsByAadhar = async (req, res) => {
  const { aadhar } = req.body;
  if (!aadhar) {
    return res
      .status(400)
      .json({ valid: false, message: "Aadhar number required" });
  }

  // find all student records with this aadhar (same person across institutes)
  const studentDocs = await Student.find({ aadhar })
    .select("_id name regNumber institute")
    .lean();

  if (!studentDocs || studentDocs.length === 0) {
    return res
      .status(404)
      .json({ valid: false, message: "No students found with this aadhar" });
  }

  // group by institute
  const instituteIds = [
    ...new Set(studentDocs.map((s) => String(s.institute))),
  ];

  const institutesStats = await Promise.all(
    instituteIds.map(async (instId) => {
      const instituteId = new mongoose.Types.ObjectId(instId);

      // fetch institute info (name, code)
      const instituteInfo = await Institute.findById(instituteId)
        .select("name code")
        .lean();

      // fetch student(s) for this institute
      const studentsInInst = studentDocs.filter(
        (s) => String(s.institute) === instId
      );

      // collect stats for each student separately
      const studentsData = await Promise.all(
        studentsInInst.map(async (student) => {
          // attendance
          const attendance = await Attendance.findOne({
            student: student._id,
            institute: instituteId,
          }).lean();

          let attendancePercent = "—";
          if (attendance && attendance.totalHeld > 0) {
            attendancePercent = (
              (attendance.totalAttended / attendance.totalHeld) *
              100
            ).toFixed(2);
          }

          // grade
          const grade = await Grade.findOne({
            student: student._id,
            institute: instituteId,
          }).lean();

          const cgpa = grade ? grade.cgpa.toFixed(2) : "—";

          // activities (status remapped)
          const activities = await Activity.find({
            student: student._id,
            institute: instituteId,
          })
            .select(
              "title description credentialId status remarks isIssuerVerificationRequired isIssuerVerified activityType createdAt"
            )
            .lean();

          const mappedActivities = activities.map((a) => ({
            ...a,
            status:
              a.status === "Approved"
                ? "Validated"
                : a.status === "Rejected"
                ? "Un-validated"
                : "Un-Looked",
          }));

          return {
            _id: student._id,
            name: student.name,
            regNumber: student.regNumber,
            academics: {
              attendance: attendancePercent,
              cgpa,
            },
            activities: mappedActivities,
          };
        })
      );

      return {
        institute: {
          _id: instituteId,
          name: instituteInfo?.name || "Unknown",
          code: instituteInfo?.code || "N/A",
        },
        student: studentsData,
      };
    })
  );

  return res.status(200).json({
    valid: true,
    message: "Student details fetched institute-wise for given aadhar",
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

//================Manager Verification Session Details===========

module.exports.getIssuerApprovalSession = async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ valid: false, message: "Token is required" });
  }

  // Find session and populate student + activity
  const session = await IssuerApprovalSession.findOne({ token })
    .populate({
      path: "activity",
      select: "title description activityType createdAt",
      populate: {
        path: "student",
        select: "name regNumber email department",
      },
    })
    .lean();

  if (!session) {
    return res
      .status(404)
      .json({ valid: false, message: "Session not found or expired" });
  }

  // Exclude token and managerEmail
  const { token: _token, issuerEmail, ...sessionWithoutSensitive } = session;

  return res.status(200).json({
    valid: true,
    message: "Issuer approval session fetched successfully",
    session: sessionWithoutSensitive,
  });
};

// ================== Manager Verify Activity ==================
module.exports.verifyIssuerApproval = async (req, res) => {
  const { token, credentialId } = req.body; // both required
  if (!token || !credentialId) {
    return res
      .status(400)
      .json({ valid: false, message: "Token and credentialId are required" });
  }

  // find session
  const session = await IssuerApprovalSession.findOne({ token });
  if (!session) {
    return res
      .status(400)
      .json({ valid: false, message: "Invalid or expired session" });
  }

  // check expiry (auto-delete is set, but double-check here)
  if (session.expiresAt < new Date()) {
    return res
      .status(400)
      .json({ valid: false, message: "This approval link has expired" });
  }

  // update activity: verify credentialId matches
  const activity = await Activity.findById(session.activity);
  if (!activity) {
    return res
      .status(404)
      .json({ valid: false, message: "Activity not found" });
  }

  if (activity.credentialId.toUpperCase() !== credentialId.toUpperCase()) {
    return res.status(400).json({
      valid: false,
      message: "Credential ID mismatch. Verification failed.",
    });
  }

  // mark issuer verified
  activity.isIssuerVerified = true;
  await activity.save();

  // delete session after use
  await IssuerApprovalSession.deleteOne({ _id: session._id });

  return res.status(200).json({
    valid: true,
    message: "Activity verified successfully",
    activity,
  });
};
