const mongoose = require("mongoose");

const studentPortfolioSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    title: { type: String, default: "Portfolio" },
    description: { type: String },
    fileUrl: { type: String, required: true }, // Cloudinary URL
    publicId: { type: String, required: true }, // Cloudinary public_id
    institute: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institute",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StudentPortfolio", studentPortfolioSchema);
