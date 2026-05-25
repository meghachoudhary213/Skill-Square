const mongoose = require("mongoose");

const EnrollmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  courseId: {
    type: String,
    required: true,
    trim: true,
  },
  courseName: {
    type: String,
    required: true,
    trim: true,
  },
  amountPaid: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ["UPI", "Net Banking", "Debit/Credit Card"],
  },
  paymentDetails: {
    type: Map,
    of: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["success", "pending", "failed"],
    default: "success",
  },
  enrolledAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Enrollment", EnrollmentSchema);
