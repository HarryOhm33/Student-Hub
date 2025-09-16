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
    attachmentLink: { type: String }, // frontend provides a link (Drive/Cloud)
    credentialId: { type: String, required: true, unique: true }, // unique activity credential
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
    remarks: { type: String }, // faculty can add remarks when validating
  },
  { timestamps: true }
);

module.exports = mongoose.model("Activity", activitySchema);
