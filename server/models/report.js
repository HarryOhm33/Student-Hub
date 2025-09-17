const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    institute: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institute",
      required: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String },
    type: {
      type: String,
      enum: ["NAAC", "AICTE", "NIRF"],
      required: true,
    },
    fileUrl: { type: String, required: true }, // Cloudinary URL
    publicId: { type: String, required: true }, // Cloudinary public ID
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
