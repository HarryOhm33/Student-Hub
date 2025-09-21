const mongoose = require("mongoose");

const issuerApprovalSessionSchema = new mongoose.Schema(
  {
    activity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Activity",
      required: true,
    },
    issuerEmail: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    expiresAt: {
      type: Date,
      default: () => Date.now() + 5 * 24 * 60 * 60 * 1000, // expires in 5 days
      index: { expires: "5d" }, // MongoDB TTL auto delete
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "IssuerApprovalSession",
  issuerApprovalSessionSchema
);
