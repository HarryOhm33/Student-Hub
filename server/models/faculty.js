const mongoose = require("mongoose");

const facultySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    employeeId: { type: String, required: true, unique: true },
    department: { type: String, required: true },
    designation: { type: String, required: true }, // e.g., Professor, Assistant Professor
    role: { type: String, default: "faculty" },
    institute: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institute",
      default: null,
    },
    isVerified: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Faculty = mongoose.model("Faculty", facultySchema);
module.exports = Faculty;
