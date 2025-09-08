const mongoose = require("mongoose");

const organizationSchema = new mongoose.Schema(
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
    organizationEmail: {
      type: String,
      required: true,
    },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Organization", organizationSchema);
