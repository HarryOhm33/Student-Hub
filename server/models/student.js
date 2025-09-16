const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    regNumber: { type: String, required: true, unique: true },
    department: { type: String, required: true },
    course: { type: String, required: true },
    year: { type: String, required: true },
    aadhar: { type: String, required: true }, // fixed
    role: { type: String, default: "student" },
    institute: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institute",
      default: null,
    },
    isVerified: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Student = mongoose.model("Student", studentSchema);
module.exports = Student;
