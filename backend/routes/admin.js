const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Contact = require("../models/Contact");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "skillsquare_secret_key_123";

// Default secure admin credentials
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@skillsquare.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

// Middleware to authenticate Admin JWT
const protectAdmin = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, JWT_SECRET);

      // Verify that token subject is indeed admin
      if (decoded.role !== "admin") {
        return res.status(403).json({ success: false, message: "Not authorized as admin" });
      }

      req.admin = { email: ADMIN_EMAIL, role: "admin" };
      next();
    } catch (error) {
      return res.status(401).json({ success: false, message: "Not authorized, invalid token" });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized, no token provided" });
  }
};

// @route   POST /api/admin/login
// @desc    Admin login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please enter all fields" });
    }

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Generate token with admin role
      const token = jwt.sign({ email, role: "admin" }, JWT_SECRET, { expiresIn: "30d" });

      res.json({
        success: true,
        message: "Admin login successful!",
        token,
        admin: {
          email: ADMIN_EMAIL,
        },
      });
    } else {
      res.status(400).json({ success: false, message: "Invalid admin credentials" });
    }
  } catch (error) {
    console.error("Admin Login Error:", error);
    res.status(500).json({ success: false, message: "Server error during admin login" });
  }
});

// @route   GET /api/admin/users
// @desc    Get all registered students (Protected)
router.get("/users", protectAdmin, async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 }).select("-password");
    res.json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Fetch Users Error:", error);
    res.status(500).json({ success: false, message: "Server error fetching students list" });
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete a student (Protected)
router.delete("/users/:id", protectAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }
    res.json({
      success: true,
      message: "Student deleted successfully!",
    });
  } catch (error) {
    console.error("Delete User Error:", error);
    res.status(500).json({ success: false, message: "Server error deleting student" });
  }
});

// @route   GET /api/admin/contacts
// @desc    Get all contact messages (Protected)
router.get("/contacts", protectAdmin, async (req, res) => {
  try {
    const contacts = await Contact.find({}).sort({ createdAt: -1 });
    res.json({
      success: true,
      contacts,
    });
  } catch (error) {
    console.error("Fetch Contacts Error:", error);
    res.status(500).json({ success: false, message: "Server error fetching contact messages" });
  }
});

// @route   DELETE /api/admin/contacts/:id
// @desc    Delete a contact message (Protected)
router.delete("/contacts/:id", protectAdmin, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }
    res.json({
      success: true,
      message: "Message deleted successfully!",
    });
  } catch (error) {
    console.error("Delete Contact Error:", error);
    res.status(500).json({ success: false, message: "Server error deleting message" });
  }
});

module.exports = router;
