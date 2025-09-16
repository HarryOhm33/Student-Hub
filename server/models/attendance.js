const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Faculty",
      required: true,
    },
    institute: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institute",
      required: true,
    },
    // course: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Course",
    //   required: true,
    // },
    // semester: { type: Number, required: true },

    // Instead of per-date status, track cumulative stats
    totalHeld: { type: Number, default: 0 }, // total classes conducted
    totalAttended: { type: Number, default: 0 }, // classes student attended
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attendance", attendanceSchema);
