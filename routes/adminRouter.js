const express = require("express");
const router = express.Router();
const User = require("../models/usermodel");
const bcrypt = require('bcrypt');
const { sendMail } = require('../middleware/email');
const { registerOTP } = require('../utils/sendEmail');
const { secure, adminOnly } = require("../middleware/authMiddleware");


router.post("/create-admin", async (req, res) => {
  try {
    const adminExists = await User.findOne({ role: "admin" });

    if (adminExists) {
      return res.status(403).json({
        message: "Admin already exists. Setup disabled."
      });
    }

    const { name, email, password } = req.body;

    // check if user already exist
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    
        if (existingUser) {
            return res.status(400).json({
                message: 'User already exist'
            })
        }

    const saltRound = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, saltRound);
    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const admin = await User.create({
      name,
      email,
      password: hashPassword,
      otp: otp,
      otpExpiry: Date.now() + 10 * 60 * 1000, // 10 minutes from now
      role: "admin"
    });

    const firstName = (admin?.name || "").trim().split(" ")[0];
    
    const subject = `Hello ${firstName}, kindly verify your email`;
    
    const htmlContent = registerOTP(admin.otp, firstName);
    
    const details = {
            email: admin.email,
            subject,
            html: htmlContent,
        };
    
            await sendMail(details);

    res.status(201).json({
      message: "Admin account created successfully",
      admin: {
        id: admin._id,
        email: admin.email,
        role: admin.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Admin setup failed" });
  }
});


router.put('/make-admin/:id', secure, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = "admin";
    await user.save();

    res.json({
      message: "User promoted to admin",
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
