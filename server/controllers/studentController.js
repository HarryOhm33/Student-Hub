const Attendance = require("../models/attendance");
const Grade = require("../models/grade");
const Activity = require("../models/activity");
const Faculty = require("../models/faculty");
const cloudinary = require("../config/coudinary");

// ================== Get Student Performance ==================

module.exports.getMyAcademics = async (req, res) => {
  const studentId = req.user._id;

  // fetch attendance & grade
  const attendance = await Attendance.findOne({ student: studentId });
  const grade = await Grade.findOne({ student: studentId });

  // fetch approved activities
  const activities = await Activity.find({
    student: studentId,
    status: "Approved",
  }).select(
    "title description credentialId activityType attachmentLink remarks createdAt"
  );

  res.status(200).json({
    valid: true,
    message: "Student academics fetched successfully",
    attendance,
    grade,
    approvedActivities: activities,
  });
};

// ================== Get Faculty List ==================
module.exports.getFacultyList = async (req, res) => {
  const faculties = await Faculty.find(
    { institute: req.user.institute },
    { name: 1 } // only return name + _id
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

// ================== Student: Apply for Activity ==================
module.exports.applyActivity = async (req, res) => {
  const { title, description, credentialId, appliedTo, activityType } =
    req.body;
  let attachmentLink = null;

  const faculty = await Faculty.findById(appliedTo);
  if (!faculty) {
    return res.status(404).json({ message: "Faculty not found" });
  }

  // upload file if present
  if (req.file) {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "activities" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    attachmentLink = result.secure_url;
  }

  // create new activity
  const activity = await Activity.create({
    student: req.user._id, // from auth middleware
    faculty: appliedTo, // faculty to validate
    institute: req.user.institute, // institute from user token/session
    title,
    description,
    attachmentLink,
    credentialId,
    activityType,
    status: "Pending",
  });

  res.status(200).json({
    valid: true,
    message: "Activity applied successfully. Awaiting faculty approval.",
    activity,
  });
};

// ================== Student: Get Own Activities ==================
module.exports.getMyActivities = async (req, res) => {
  const activities = await Activity.find({ student: req.user._id })
    .populate("faculty", "name email") // show faculty info
    .sort({ createdAt: -1 }); // latest first

  if (!activities || activities.length === 0) {
    return res.status(404).json({ message: "No activity requests found" });
  }

  res.status(200).json({
    valid: true,
    message: "Your activity requests fetched successfully",
    activities,
  });
};
