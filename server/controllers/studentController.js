const Attendance = require("../models/attendance");
const Grade = require("../models/grade");
const Activity = require("../models/activity");
const Faculty = require("../models/faculty");
const Student = require("../models/student");
const StudentPortfolio = require("../models/studentPortfolio");
const cloudinary = require("../config/coudinary");
const PDFDocument = require("pdfkit");
const { askGemini } = require("../config/gemini");

// ================== Get Dashboard Data (processed for charts/cards) ==================
module.exports.getDashboardData = async (req, res) => {
  const studentId = req.user._id;

  // --- Student Info ---
  const student = await Student.findById(studentId).select("-password");
  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  // --- Academics ---
  const attendance = await Attendance.findOne({ student: studentId });
  const grade = await Grade.findOne({ student: studentId });

  // --- Activities ---
  const activities = await Activity.find({ student: studentId });

  // Gemini Data
  const activitiesGemini = await Activity.find({
    student: studentId,
    status: "Approved",
  });

  const studentDataGemini = {
    attendance,
    grade,
    activitiesGemini,
  };

  // custom prompt
  const prompt = `
  You are a career mentor speaking directly to a student. 
  Your tone should be clear, encouraging, and straight to the point. 
  Never say "the student" or talk in third person — always use "you".  

  Use this structure in your response:

  **Career Paths:**  
  Briefly suggest possible career directions based on academics, attendance, and activities.  

  **Strengths:**  
  Point out what the student is doing well.  

  **Areas to Improve:**  
  Give direct advice on weak areas (be constructive, not harsh).  

  **Recommendations:**  
  Actionable next steps the student should take (skills, habits, opportunities).  

  Keep the response concise (6–8 sentences max). 
  Avoid long paragraphs — use short, impactful sentences.`;

  const insights = await askGemini(prompt, studentDataGemini);

  // Attendance Stats
  let attendancePercent = 0;
  if (attendance?.totalHeld > 0) {
    attendancePercent = (
      (attendance.totalAttended / attendance.totalHeld) *
      100
    ).toFixed(2);
  }

  // Activities Stats
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

  // Build Dashboard Response
  const dashboardData = {
    student: {
      name: student.name,
      regNumber: student.regNumber,
      email: student.email,
      department: student.department,
    },
    academics: {
      cgpa: grade?.cgpa || null,
      attendance: {
        totalHeld: attendance?.totalHeld || 0,
        totalAttended: attendance?.totalAttended || 0,
        percentage: attendancePercent,
      },
    },
    activities: {
      total: totalActivities,
      approved: approvedActivities,
      pending: pendingActivities,
      rejected: rejectedActivities,
      breakdown: {
        curricular: activities.filter((a) => a.activityType === "Curricular")
          .length,
        coCurricular: activities.filter(
          (a) => a.activityType === "Co-Curricular"
        ).length,
        extraCurricular: activities.filter(
          (a) => a.activityType === "Extra-Curricular"
        ).length,
      },
    },
    // Example chart data structure (you can map directly in frontend)
    charts: {
      attendanceTrend: [
        { label: "Attended", value: attendance?.totalAttended || 0 },
        {
          label: "Missed",
          value:
            (attendance?.totalHeld || 0) - (attendance?.totalAttended || 0),
        },
      ],
      activityStatus: [
        { label: "Approved", value: approvedActivities },
        { label: "Pending", value: pendingActivities },
        { label: "Rejected", value: rejectedActivities },
      ],
      activityTypes: [
        {
          label: "Curricular",
          value: activities.filter((a) => a.activityType === "Curricular")
            .length,
        },
        {
          label: "Co-Curricular",
          value: activities.filter((a) => a.activityType === "Co-Curricular")
            .length,
        },
        {
          label: "Extra-Curricular",
          value: activities.filter((a) => a.activityType === "Extra-Curricular")
            .length,
        },
      ],
    },
    ai_insights: insights,
  };

  res.status(200).json({
    valid: true,
    message: "Dashboard data fetched successfully",
    dashboard: dashboardData,
  });
};

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

// ================== Upload Portfolios (student) ==================

module.exports.uploadPortfolioFile = async (req, res) => {
  const { title, description } = req.body;
  const studentId = req.user._id;

  //   console.log(req.file);
  //   console.log(req.body);

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  // Upload file buffer to Cloudinary as raw (for PDF/docx/etc.)
  const uploadResult = await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "student_portfolios",
        resource_type: "raw", // ✅ ensures proper MIME for PDF
        public_id: `${studentId}_${Date.now()}`,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(req.file.buffer);
  });

  // Save in DB
  const portfolio = await StudentPortfolio.create({
    student: studentId,
    title: title || `${req.user.name}'s Portfolio`,
    description: description || "",
    fileUrl: uploadResult.secure_url, // works for open/download
    publicId: uploadResult.public_id,
    institute: req.user.institute,
  });

  res.status(200).json({
    valid: true,
    message: "Portfolio uploaded successfully",
    portfolio,
  });
};

// ================== Get My Portfolios (student) ==================
module.exports.getMyPortfolios = async (req, res) => {
  const portfolios = await StudentPortfolio.find({
    student: req.user._id,
  }).sort({ createdAt: -1 });

  if (!portfolios || portfolios.length === 0) {
    return res.status(404).json({ message: "No portfolios found" });
  }

  res.status(200).json({
    valid: true,
    message: "Portfolios fetched successfully",
    portfolios,
  });
};

// ================== Get Portfolio By Id (student/admin/faculty) ==================
// module.exports.getPortfolioById = async (req, res) => {
//   const { id } = req.params;

//   const portfolio = await StudentPortfolio.findById(id).populate(
//     "student",
//     "name regNumber email"
//   );

//   if (!portfolio) {
//     return res.status(404).json({ message: "Portfolio not found" });
//   }

//   // optional: restrict access — for now return if same institute OR owner
//   if (
//     String(portfolio.institute) !== String(req.user.institute) &&
//     String(portfolio.student._id) !== String(req.user._id)
//   ) {
//     return res.status(403).json({ message: "Access denied" });
//   }

//   res.status(200).json({
//     valid: true,
//     message: "Portfolio fetched successfully",
//     portfolio,
//   });
// };
