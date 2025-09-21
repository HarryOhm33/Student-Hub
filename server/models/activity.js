const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Faculty",
    },
    title: { type: String, required: true }, // e.g. "Hackathon Participation"
    description: { type: String }, // optional details
    attachmentLink: { type: String }, // Drive/Cloud/Cloudinary link
    credentialId: { type: String, required: true, unique: true }, // unique credential
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    activityType: {
      type: String,
      enum: ["Curricular", "Co-Curricular", "Extra-Curricular"],
    },
    institute: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institute",
      required: true,
    },
    remarks: { type: String }, // faculty validation remarks
    // 🔹 Manager approval stage
    isIssuerVerificationRequired: {
      type: Boolean,
      default: false,
    },
    isIssuerVerified: {
      type: Boolean,
      default: false, // stays false until manager approves
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Activity", activitySchema);
