const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/User");
const OTP = require("../models/OTP");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "skillsquare_secret_key_123";

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
  },
  connectionTimeout: 5000, // 5 seconds
  greetingTimeout: 5000,    // 5 seconds
  socketTimeout: 5000,      // 5 seconds
});

// Middleware to authenticate JWT
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Get user from DB excluding password
      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) {
        return res.status(401).json({ success: false, message: "User not found" });
      }
      next();
    } catch (error) {
      return res.status(401).json({ success: false, message: "Not authorized, invalid token" });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized, no token provided" });
  }
};

// Helper: Generate a secure 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Helper: Send OTP via Email (with graceful terminal console fallback)
const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: `"Skill Square Security" <${process.env.SMTP_USER || "no-reply@skillsquare.com"}>`,
    to: email,
    subject: "Your OTP Verification Code - Skill Square",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #ffffff;">
        <h2 style="color: #f1c40f; text-align: center; margin-bottom: 30px;">Skill Square Verification Code</h2>
        <p style="font-size: 16px; color: #333333; line-height: 1.6;">Hello,</p>
        <p style="font-size: 16px; color: #333333; line-height: 1.6;">To complete your secure request on Skill Square, please use the following One-Time Password (OTP) verification code. This code is valid for <strong>5 minutes</strong>.</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; padding: 12px 30px; background-color: #f9f9f9; border: 1px dashed #f1c40f; border-radius: 8px; color: #2c3e50; display: inline-block;">${otp}</span>
        </div>
        <p style="font-size: 14px; color: #7f8c8d; line-height: 1.6;">If you did not make this request, please secure your account immediately or ignore this email.</p>
        <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 30px 0;" />
        <p style="font-size: 12px; color: #95a5a6; text-align: center; line-height: 1.6;">&copy; ${new Date().getFullYear()} Skill Square. All rights reserved.</p>
      </div>
    `,
  };

  // Always log to terminal for immediate development bypass accessibility
  console.log(`
==================================================
🔑 [SKILL SQUARE OTP GENERATED]
Recipient: ${email}
OTP Code:  ${otp}
Timestamp: ${new Date().toLocaleTimeString()}
==================================================
  `);

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log("⚠️ SMTP credentials not found in env. Aborting.");
    throw new Error("SMTP email credentials (SMTP_USER/SMTP_PASS) are not configured in your Render environment variables.");
  }

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✉️ OTP email sent successfully to ${email}`);
    return true;
  } catch (error) {
    console.error("❌ Failed to send OTP email via SMTP:", error.message);
    throw new Error("SMTP Mail Delivery Failed: " + error.message);
  }
};

// @route   POST /api/auth/send-otp
// @desc    Generate and send registration OTP
router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: "User with this email already exists" });
    }

    const otpCode = generateOTP();

    // Store/Update OTP in DB (delete existing for same email)
    await OTP.deleteMany({ email: email.toLowerCase() });
    await OTP.create({
      email: email.toLowerCase(),
      otp: otpCode,
    });

    // Send OTP
    const sent = await sendOTPEmail(email, otpCode);

    res.status(200).json({
      success: true,
      message: sent 
        ? "Verification OTP code sent to your email!" 
        : "OTP generated successfully! Check your Node server console log to verify.",
    });
  } catch (error) {
    console.error("Send Registration OTP Error:", error);
    res.status(500).json({ success: false, message: "Server error generating OTP: " + error.message });
  }
});

// @route   POST /api/auth/send-forgot-otp
// @desc    Generate and send reset password OTP
router.post("/send-forgot-otp", async (req, res) => {
  try {
    const { email, phone } = req.body;
    if (!email || !phone) {
      return res.status(400).json({ success: false, message: "Email and phone number are required" });
    }

    // Check if user exists
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ success: false, message: "No registered user found with this email" });
    }

    // Verify phone number (direct match or last 10 digits match)
    const inputPhoneCleaned = phone.replace(/\D/g, "");
    const dbPhoneCleaned = (user.phone || "").replace(/\D/g, "");

    const isPhoneValid = 
      phone.trim() === (user.phone || "").trim() || 
      (inputPhoneCleaned.length >= 10 && dbPhoneCleaned.length >= 10 && inputPhoneCleaned.slice(-10) === dbPhoneCleaned.slice(-10));

    if (!isPhoneValid) {
      return res.status(400).json({ success: false, message: "Registered phone number does not match" });
    }

    const otpCode = generateOTP();

    // Store/Update OTP in DB
    await OTP.deleteMany({ email: email.toLowerCase() });
    await OTP.create({
      email: email.toLowerCase(),
      otp: otpCode,
    });

    // Send OTP
    const sent = await sendOTPEmail(email, otpCode);

    res.status(200).json({
      success: true,
      message: sent 
        ? "Verification OTP code sent to your email!" 
        : "OTP generated successfully! Check your Node server console log to verify.",
    });
  } catch (error) {
    console.error("Send Forgot OTP Error:", error);
    res.status(500).json({ success: false, message: "Server error generating OTP: " + error.message });
  }
});

// @route   POST /api/auth/register
// @desc    Register new user (OTP Verified)
router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, location, password, otp } = req.body;

    if (!name || !email || !password || !otp) {
      return res.status(400).json({ success: false, message: "Please enter all required fields including OTP" });
    }

    // Password validation: minimum 8 characters, alphanumeric and symbolic
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters long and contain letters, numbers, and symbols" });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ success: false, message: "User with this email already exists" });
    }

    // Verify OTP
    const otpRecord = await OTP.findOne({ email: email.toLowerCase() });
    if (!otpRecord) {
      return res.status(400).json({ success: false, message: "OTP has expired or is invalid. Please request a new one." });
    }

    if (otpRecord.otp !== otp.trim()) {
      return res.status(400).json({ success: false, message: "Invalid OTP code. Please verify and try again." });
    }

    // OTP matches, delete record
    await OTP.deleteMany({ email: email.toLowerCase() });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      location,
      password: hashedPassword,
      role: "student", // default role for standard registration
    });

    if (user) {
      // Generate token
      const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "30d" });

      res.status(201).json({
        success: true,
        message: "Registration successful!",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          location: user.location,
          role: user.role,
        },
      });
    } else {
      res.status(400).json({ success: false, message: "Invalid user data" });
    }
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ success: false, message: "Server error during registration" });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please enter all fields" });
    }

    // Check if user exists
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    // Generate token containing id and role
    const token = jwt.sign({ id: user._id, role: user.role || "student" }, JWT_SECRET, { expiresIn: "30d" });

    res.json({
      success: true,
      message: "Login successful!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location,
        role: user.role || "student",
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: "Server error during login" });
  }
});

// @route   GET /api/auth/profile
// @desc    Get user profile (Protected)
router.get("/profile", protect, (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

// @route   POST /api/auth/reset-password
// @desc    Reset user password by email, phone & OTP
router.post("/reset-password", async (req, res) => {
  try {
    const { email, phone, newPassword, otp } = req.body;

    if (!email || !phone || !newPassword || !otp) {
      return res.status(400).json({ success: false, message: "Please enter all required fields including OTP" });
    }

    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters long and contain letters, numbers, and symbols" });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ success: false, message: "User with this email not found" });
    }

    // Verify phone number (direct match or last 10 digits match)
    const inputPhoneCleaned = phone.replace(/\D/g, "");
    const dbPhoneCleaned = (user.phone || "").replace(/\D/g, "");

    const isPhoneValid = 
      phone.trim() === (user.phone || "").trim() || 
      (inputPhoneCleaned.length >= 10 && dbPhoneCleaned.length >= 10 && inputPhoneCleaned.slice(-10) === dbPhoneCleaned.slice(-10));

    if (!isPhoneValid) {
      return res.status(400).json({ success: false, message: "Registered phone number does not match" });
    }

    // Verify OTP
    const otpRecord = await OTP.findOne({ email: email.toLowerCase() });
    if (!otpRecord) {
      return res.status(400).json({ success: false, message: "OTP has expired or is invalid. Please request a new one." });
    }

    if (otpRecord.otp !== otp.trim()) {
      return res.status(400).json({ success: false, message: "Invalid OTP code. Please verify and try again." });
    }

    // OTP matches, delete records
    await OTP.deleteMany({ email: email.toLowerCase() });

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Save the new password
    user.password = hashedPassword;
    await user.save();

    res.json({
      success: true,
      message: "Password reset successful! You can now log in with your new password.",
    });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ success: false, message: "Server error during password reset" });
  }
});

module.exports = router;
