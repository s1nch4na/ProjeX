import express from 'express';
import cors from 'cors';
import pool from './db.js';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';

const app = express();

// Middleware so frontend can talk to backend and handle JSON data
app.use(cors());
app.use(express.json());

// Setup email sender (Replace with your email and Gmail App Password)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-gmail-app-password'
  }
});

// ==========================================
// 1. TEST GET ROUTE (To check if server works)
// ==========================================
app.get('/', (req, res) => {
  res.json({ message: "ProjeX backend is running!" });
});

// ==========================================
// 2. SIGNUP POST ROUTE (Generates & emails OTP)
// ==========================================
app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Generate 6-digit OTP code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user info and OTP into Neon database
    await pool.query(
      `INSERT INTO users (email, name, role, password_hash, otp_code, otp_expires_at, is_profile_complete) 
       VALUES ($1, $2, $3, $4, $5, $6, false)
       ON CONFLICT (email) DO UPDATE 
       SET otp_code = $5, otp_expires_at = $6, password_hash = $4, name = $2, role = $3`,
      [email, name, role || 'student', hashedPassword, otp, otpExpires]
    );

    // Send the OTP via email
    await transporter.sendMail({
      from: '"ProjeX Network" <your-email@gmail.com>',
      to: email,
      subject: 'Your ProjeX Verification Code',
      text: `Your verification code is: ${otp}. It expires in 10 minutes.`
    });

    res.json({ success: true, message: "OTP sent successfully to email." });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ success: false, error: "Server error during signup." });
  }
});

// ==========================================
// 3. VERIFY OTP POST ROUTE
// ==========================================
app.post('/api/auth/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ success: false, error: "User not found." });
    }

    const user = result.rows[0];

    // Check if OTP matches and is not expired
    if (!user.otp_code || user.otp_code !== otp.toString().trim() || new Date() > new Date(user.otp_expires_at)) {
      return res.status(400).json({ success: false, error: "Invalid or expired OTP code." });
    }

    // Clear OTP upon successful verification
    await pool.query(
      'UPDATE users SET otp_code = NULL, otp_expires_at = NULL WHERE email = $1',
      [email]
    );

    res.json({ success: true, user });
  } catch (err) {
    console.error("Verification error:", err);
    res.status(500).json({ success: false, error: "Server error during verification." });
  }
});

// ==========================================
// 4. LOGIN POST ROUTE
// ==========================================
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: "User not found. Please sign up." });
    }

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    
    if (!match) {
      return res.status(401).json({ success: false, error: "Incorrect password." });
    }

    res.json({ success: true, user });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, error: "Server database error." });
  }
});

// Start the server on port 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});