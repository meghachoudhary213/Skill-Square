const express = require("express");
const nodemailer = require("nodemailer");
const Contact = require("../models/Contact");

const router = express.Router();

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
  },
});

// Helper: Send Contact Form Details via Email (with graceful terminal console fallback)
const sendContactEmail = async (name, email, phone, subject, message) => {
  const mailOptions = {
    from: `"Skill Square Support" <${process.env.SMTP_USER || "no-reply@skillsquare.com"}>`,
    to: "megha20202002@gmail.com",
    subject: `New Contact Form Message: ${subject}`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <h2 style="color: #d4af37; font-size: 24px; font-weight: 700; margin-top: 0; margin-bottom: 24px; border-bottom: 2px solid #f1c40f; padding-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px;">New Contact Message Received</h2>
        
        <p style="font-size: 16px; color: #4a5568; line-height: 1.6; margin-bottom: 20px;">A user has submitted a new inquiry through the Skill Square contact form. Here are the details:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
          <tr>
            <td style="padding: 10px 12px; font-weight: bold; width: 120px; color: #718096; border-bottom: 1px solid #edf2f7;">Sender Name:</td>
            <td style="padding: 10px 12px; color: #2d3748; border-bottom: 1px solid #edf2f7; font-size: 15px;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 10px 12px; font-weight: bold; color: #718096; border-bottom: 1px solid #edf2f7;">Sender Email:</td>
            <td style="padding: 10px 12px; color: #2d3748; border-bottom: 1px solid #edf2f7; font-size: 15px;"><a href="mailto:${email}" style="color: #d4af37; text-decoration: none; font-weight: 600;">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px 12px; font-weight: bold; color: #718096; border-bottom: 1px solid #edf2f7;">Mobile Number:</td>
            <td style="padding: 10px 12px; color: #2d3748; border-bottom: 1px solid #edf2f7; font-size: 15px; font-weight: 600;">${phone || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 10px 12px; font-weight: bold; color: #718096; border-bottom: 1px solid #edf2f7;">Subject:</td>
            <td style="padding: 10px 12px; color: #2d3748; border-bottom: 1px solid #edf2f7; font-size: 15px; font-weight: 600;">${subject}</td>
          </tr>
        </table>
        
        <div style="background-color: #f7fafc; border-left: 4px solid #d4af37; padding: 20px; border-radius: 8px; margin-top: 15px;">
          <p style="margin: 0; font-weight: bold; color: #4a5568; margin-bottom: 10px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">User Message:</p>
          <p style="margin: 0; color: #2d3748; line-height: 1.6; white-space: pre-wrap; font-size: 15px;">${message}</p>
        </div>
        
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
        <p style="font-size: 12px; color: #a0aec0; text-align: center; line-height: 1.6; margin: 0;">&copy; ${new Date().getFullYear()} Skill Square. All rights reserved.</p>
      </div>
    `,
  };

  // Always log to terminal for immediate development bypass accessibility
  console.log(`
==================================================
📬 [SKILL SQUARE CONTACT FORM SUBMISSION]
Sender: ${name} <${email}>
Phone: ${phone || 'N/A'}
Subject: ${subject}
Message: ${message}
Timestamp: ${new Date().toLocaleTimeString()}
==================================================
  `);

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log("⚠️ SMTP credentials not found in env. Falling back to console logging only.");
    return false; // Indicated mock fallback
  }

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✉️ Contact message email successfully forwarded to megha20202002@gmail.com`);
    return true;
  } catch (error) {
    console.error("❌ Failed to send contact form email via SMTP:", error.message);
    return false;
  }
};

// @route   POST /api/contact
// @desc    Submit contact message
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: "Please fill all fields" });
    }

    // Save contact message
    const contactMessage = await Contact.create({
      name,
      email,
      phone,
      subject,
      message,
    });

    if (contactMessage) {
      // Send email notification to megha20202002@gmail.com
      await sendContactEmail(name, email, phone, subject, message);

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
