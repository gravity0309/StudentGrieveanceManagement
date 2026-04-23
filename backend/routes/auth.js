const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Student = require("../models/Student");

// Helper: Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d"
  });
};

// @route   POST /api/register
// @desc    Register a new student
// @access  Public
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide name, email, and password." });
    }

    // Check if student already exists
    const existingStudent = await Student.findOne({ email: email.toLowerCase() });
    if (existingStudent) {
      return res.status(409).json({ message: "A student with this email already exists." });
    }

    // Create new student (password hashed via pre-save hook)
    const student = await Student.create({ name, email, password });

    res.status(201).json({
      message: "Student registered successfully.",
      student: {
        id: student._id,
        name: student.name,
        email: student.email
      },
      token: generateToken(student._id)
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(". ") });
    }
    res.status(500).json({ message: "Server error during registration.", error: err.message });
  }
});

// @route   POST /api/login
// @desc    Authenticate student and return JWT
// @access  Public
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password." });
    }

    // Find student by email
    const student = await Student.findOne({ email: email.toLowerCase() });
    if (!student) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Compare passwords
    const isMatch = await student.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    res.status(200).json({
      message: "Login successful.",
      student: {
        id: student._id,
        name: student.name,
        email: student.email
      },
      token: generateToken(student._id)
    });
  } catch (err) {
    res.status(500).json({ message: "Server error during login.", error: err.message });
  }
});

module.exports = router;
