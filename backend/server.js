const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const authRoutes = require("./routes/auth");
const grievanceRoutes = require("./routes/grievances");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get("/", (req, res) => {
  res.json({
    message: "Student Grievance Management System API is running",
    version: "1.0.0",
    endpoints: {
      auth: [
        "POST /api/register",
        "POST /api/login"
      ],
      grievances: [
        "POST /api/grievances",
        "GET /api/grievances",
        "GET /api/grievances/search?title=xyz",
        "GET /api/grievances/:id",
        "PUT /api/grievances/:id",
        "DELETE /api/grievances/:id"
      ]
    }
  });
});

// Routes
app.use("/api", authRoutes);
app.use("/api/grievances", grievanceRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("ERROR: MONGO_URI is not defined in environment variables.");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });

module.exports = app;
