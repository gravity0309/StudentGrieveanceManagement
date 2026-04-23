const mongoose = require("mongoose");

const grievanceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [200, "Title cannot exceed 200 characters"]
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters"],
      maxlength: [2000, "Description cannot exceed 2000 characters"]
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: ["Academic", "Hostel", "Transport", "Other"],
        message: "Category must be one of: Academic, Hostel, Transport, Other"
      }
    },
    date: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: {
        values: ["Pending", "Resolved"],
        message: "Status must be either Pending or Resolved"
      },
      default: "Pending"
    }
  },
  { timestamps: true }
);

// Index for search performance
grievanceSchema.index({ title: "text", description: "text" });

module.exports = mongoose.model("Grievance", grievanceSchema);
