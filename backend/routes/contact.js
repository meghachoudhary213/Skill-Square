const express = require("express");
const Contact = require("../models/Contact");

const router = express.Router();

// @route   POST /api/contact
// @desc    Submit contact message
router.post("/", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: "Please fill all fields" });
    }

    // Save contact message
    const contactMessage = await Contact.create({
      name,
      email,
      subject,
      message,
    });

    if (contactMessage) {
      res.status(201).json({
        success: true,
        message: "Your message has been received. Thank you!",
      });
    } else {
      res.status(400).json({ success: false, message: "Failed to save message" });
    }
  } catch (error) {
    console.error("Contact Form Error:", error);
    res.status(500).json({ success: false, message: "Server error while saving message" });
  }
});

module.exports = router;
