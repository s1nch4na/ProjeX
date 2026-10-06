import express from 'express';
import cors from 'cors';
import pool from './db.js';
import bcrypt from 'bcrypt';

const app = express();

app.use(
  cors({
    origin: "https://proje-x-five.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: "ProjeX backend is running!"
  });
});


// =====================================================
// SIGNUP
// =====================================================

app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: "Email already registered. Please log in."
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertResult = await pool.query(
      `INSERT INTO users
       (
         email,
         name,
         role,
         password_hash,
         is_profile_complete
       )
       VALUES ($1, $2, $3, $4, false)
       RETURNING *`,
      [
        email,
        name,
        role || 'student',
        hashedPassword
      ]
    );

    res.json({
      success: true,
      user: insertResult.rows[0]
    });

  } catch (err) {
    console.error("❌ Signup error:", err);

    res.status(500).json({
      success: false,
      error: "Server database error during signup."
    });
  }
});


// =====================================================
// LOGIN
// =====================================================

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "User not found. Please sign up."
      });
    }

    const user = result.rows[0];

    const match = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!match) {
      return res.status(401).json({
        success: false,
        error: "Incorrect password."
      });
    }

    res.json({
      success: true,
      user
    });

  } catch (err) {
    console.error("❌ Login error:", err);

    res.status(500).json({
      success: false,
      error: "Server database error."
    });
  }
});


// =====================================================
// PROFILE ONBOARDING
// =====================================================

app.post('/api/profile/onboard', async (req, res) => {
  const {
    email,
    name,
    position,
    bio,
    skills,
    location,
    github,
    linkedin,
    resumeName,
    avatarName,
    phone,
    organization,
    website,
    interests
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE users
       SET
         name = $1,
         position = $2,
         bio = $3,
         skills = $4,
         location = $5,
         github = $6,
         linkedin = $7,
         resume_name = $8,
         avatar_name = $9,
         phone = $10,
         organization = $11,
         website = $12,
         interests = $13,
         is_profile_complete = true
       WHERE email = $14
       RETURNING *`,
      [
        name,
        position || null,
        bio || null,
        JSON.stringify(skills || []),
        location || null,
        github || null,
        linkedin || null,
        resumeName || null,
        avatarName || null,
        phone || null,
        organization || null,
        website || null,
        JSON.stringify(interests || []),
        email
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "User not found."
      });
    }

    res.json({
      success: true,
      user: result.rows[0]
    });

  } catch (err) {
    console.error("❌ Onboarding error:", err);

    res.status(500).json({
      success: false,
      error: "Server database error during onboarding."
    });
  }
});


// =====================================================
// GET PROFILE
// =====================================================

app.get('/api/profile/:id', async (req, res) => {
  const { id } = req.params;

  console.log("🔥 PROFILE REQUEST RECEIVED:", id);

  try {
    const result = await pool.query(
      `SELECT
        id,
        name,
        email,
        role,
        position,
        bio,
        skills,
        location,
        github,
        linkedin,
        resume_name,
        avatar_name,
        phone,
        organization,
        website,
        interests,
        is_profile_complete
       FROM users
       WHERE id = $1`,
      [id]
    );

    console.log(
      "🔥 PROFILE DATABASE RESULT:",
      result.rows
    );

    if (result.rows.length === 0) {
      console.log(
        "⚠️ NO USER FOUND FOR ID:",
        id
      );

      return res.status(404).json({
        success: false,
        error: "Profile not found."
      });
    }

    res.json({
      success: true,
      user: result.rows[0]
    });

  } catch (err) {
    console.error(
      "❌ Get profile error:",
      err
    );

    res.status(500).json({
      success: false,
      error: "Database error while fetching profile."
    });
  }
});


// =====================================================
// UPDATE PROFILE
// =====================================================

app.put('/api/profile/:id', async (req, res) => {
  const { id } = req.params;

  const {
    name,
    position,
    bio,
    skills,
    location,
    github,
    linkedin,
    phone,
    organization,
    website,
    interests
  } = req.body;

  console.log(
    "🔥 UPDATE PROFILE REQUEST:",
    id
  );

  try {
    const result = await pool.query(
      `UPDATE users
       SET
         name = $1,
         position = $2,
         bio = $3,
         skills = $4,
         location = $5,
         github = $6,
         linkedin = $7,
         phone = $8,
         organization = $9,
         website = $10,
         interests = $11
       WHERE id = $12
       RETURNING *`,
      [
        name,
        position || null,
        bio || null,
        JSON.stringify(skills || []),
        location || null,
        github || null,
        linkedin || null,
        phone || null,
        organization || null,
        website || null,
        JSON.stringify(interests || []),
        id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "User not found."
      });
    }

    console.log(
      "✅ PROFILE UPDATED:",
      result.rows[0].id
    );

    res.json({
      success: true,
      user: result.rows[0]
    });

  } catch (err) {
    console.error(
      "❌ Update profile error:",
      err
    );

    res.status(500).json({
      success: false,
      error: "Server database error while updating profile."
    });
  }
});


// =====================================================
// PROJECT APPLICATION
// =====================================================

app.post('/api/projects/apply', async (req, res) => {
  console.log(
    "🔥 HIT /api/projects/apply ROUTE!",
    req.body
  );

  const {
    project_id,
    user_email,
    application_type,
    team_members,
    cover_note
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO project_applications
       (
         project_id,
         user_email,
         application_type,
         team_members,
         cover_note,
         status
       )
       VALUES ($1, $2, $3, $4, $5, 'Applied')
       RETURNING *`,
      [
        project_id,
        user_email,
        application_type,
        team_members,
        cover_note
      ]
    );

    res.json({
      success: true,
      application: result.rows[0]
    });

  } catch (err) {
    console.error(
      "❌ Project application error:",
      err
    );

    res.status(500).json({
      success: false,
      error: "Database error during application submission."
    });
  }
});


// =====================================================
// SERVER
// =====================================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 ProjeX server running on port ${PORT}`
  );
});