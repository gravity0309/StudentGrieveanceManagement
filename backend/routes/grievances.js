const express = require("express");
const router = express.Router();
const Grievance = require("../models/Grievance");
const { protect } = require("../middleware/authMiddleware");

// All grievance routes are protected
router.use(protect);

// @route   GET /api/grievances/search?title=xyz
// @desc    Search grievances by title (must be before /:id route)
// @access  Private
router.get("/search", async (req, res) => {
  try {
    const { title } = req.query;

    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "Please provide a search title query parameter." });
    }

    const grievances = await Grievance.find({
      student: req.student._id,
      title: { $regex: title.trim(), $options: "i" }
    })
      .populate("student", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: `Found ${grievances.length} grievance(s) matching "${title}".`,
      count: grievances.length,
      grievances
    });
  } catch (err) {
    res.status(500).json({ message: "Server error during search.", error: err.message });
  }
});

// @route   POST /api/grievances
// @desc    Submit a new grievance
// @access  Private
router.post("/", async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ message: "Please provide title, description, and category." });
    }

    const grievance = await Grievance.create({
      student: req.student._id,
      title,
      description,
      category
    });

    await grievance.populate("student", "name email");

    res.status(201).json({
      message: "Grievance submitted successfully.",
      grievance
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(". ") });
    }
    res.status(500).json({ message: "Server error while submitting grievance.", error: err.message });
  }
});

// @route   GET /api/grievances
// @desc    View all grievances for the logged-in student
// @access  Private
router.get("/", async (req, res) => {
  try {
    const { category, status, page = 1, limit = 10 } = req.query;

    const filter = { student: req.student._id };
    if (category) filter.category = category;
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Grievance.countDocuments(filter);

    const grievances = await Grievance.find(filter)
      .populate("student", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      message: "Grievances fetched successfully.",
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      count: grievances.length,
      grievances
    });
  } catch (err) {
    res.status(500).json({ message: "Server error while fetching grievances.", error: err.message });
  }
});

// @route   GET /api/grievances/:id
// @desc    View a grievance by ID
// @access  Private
router.get("/:id", async (req, res) => {
  try {
    const grievance = await Grievance.findById(req.params.id).populate("student", "name email");

    if (!grievance) {
      return res.status(404).json({ message: "Grievance not found." });
    }

    // Ensure the grievance belongs to the logged-in student
    if (grievance.student._id.toString() !== req.student._id.toString()) {
      return res.status(403).json({ message: "Access denied. This grievance belongs to another student." });
    }

    res.status(200).json({
      message: "Grievance fetched successfully.",
      grievance
    });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid grievance ID format." });
    }
    res.status(500).json({ message: "Server error while fetching grievance.", error: err.message });
  }
});

// @route   PUT /api/grievances/:id
// @desc    Update a grievance
// @access  Private
router.put("/:id", async (req, res) => {
  try {
    const grievance = await Grievance.findById(req.params.id);

    if (!grievance) {
      return res.status(404).json({ message: "Grievance not found." });
    }

    // Ensure the grievance belongs to the logged-in student
    if (grievance.student.toString() !== req.student._id.toString()) {
      return res.status(403).json({ message: "Access denied. You can only update your own grievances." });
    }

    const { title, description, category, status } = req.body;

    // Only update provided fields
    if (title !== undefined) grievance.title = title;
    if (description !== undefined) grievance.description = description;
    if (category !== undefined) grievance.category = category;
    if (status !== undefined) grievance.status = status;

    const updatedGrievance = await grievance.save();
    await updatedGrievance.populate("student", "name email");

    res.status(200).json({
      message: "Grievance updated successfully.",
      grievance: updatedGrievance
    });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid grievance ID format." });
    }
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(". ") });
    }
    res.status(500).json({ message: "Server error while updating grievance.", error: err.message });
  }
});

// @route   DELETE /api/grievances/:id
// @desc    Delete a grievance
// @access  Private
router.delete("/:id", async (req, res) => {
  try {
    const grievance = await Grievance.findById(req.params.id);

    if (!grievance) {
      return res.status(404).json({ message: "Grievance not found." });
    }

    // Ensure the grievance belongs to the logged-in student
    if (grievance.student.toString() !== req.student._id.toString()) {
      return res.status(403).json({ message: "Access denied. You can only delete your own grievances." });
    }

    await grievance.deleteOne();

    res.status(200).json({
      message: "Grievance deleted successfully.",
      deletedId: req.params.id
    });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid grievance ID format." });
    }
    res.status(500).json({ message: "Server error while deleting grievance.", error: err.message });
  }
});

module.exports = router;
