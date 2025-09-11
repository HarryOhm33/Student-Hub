const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, unique: true, required: true }, // e.g. CSE101
});

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, unique: true, required: true }, // e.g. B-Tech110001
});

const instituteSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      unique: true,
      required: true, // e.g. INSTITUTE123
    },
    instituteEmail: {
      type: String,
      required: true,
    },
    createdByEmail: {
      type: String,
      required: true,
    },
    departments: { type: [departmentSchema], default: [] },
    courses: { type: [courseSchema], default: [] },
    isVerified: { type: Boolean, default: false },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Institute", instituteSchema);
