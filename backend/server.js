import express from 'express';
import cors from 'cors';
import pool from './db.js';
import bcrypt from 'bcrypt';

const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.json({ message: "ProjeX backend is running!" });
});

// 1. SIGNUP ROUTE
app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ success: false, error: "Email already registered. Please log in." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertResult = await pool.query(
      `INSERT INTO users (email, name, role, password_hash, is_profile_complete) 
       VALUES ($1, $2, $3, $4, false) RETURNING *`,
      [email, name, role || 'student', hashedPassword]
    );

    res.json({ success: true, user: insertResult.rows[0] });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ success: false, error: "Server database error during signup." });
  }
});

// 2. LOGIN ROUTE
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

// 3. ONBOARDING ROUTE
// 3. ONBOARDING ROUTE
app.post('/api/profile/onboard', async (req, res) => {
  const {
    email,
    name,
    role,
    bio,
    skills,
    location,
    github,
    linkedin,
    resumeName,
    avatarName
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE users
       SET
         name = $1,
         role = $2,
         bio = $3,
         skills = $4,
         location = $5,
         github = $6,
         linkedin = $7,
         resume_name = $8,
         avatar_name = $9,
         is_profile_complete = true
       WHERE email = $10
       RETURNING *`,
      [
        name,
        role,
        bio,
        JSON.stringify(skills || []),
        location,
        github,
        linkedin,
        resumeName,
        avatarName,
        email
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "User not found"
      });
    }

    res.json({
      success: true,
      user: result.rows[0]
    });

  } catch (err) {
    console.error("Onboarding error:", err);

    res.status(500).json({
      success: false,
      error: "Server database error during onboarding."
    });
  }
});

// GET STUDENT PROFILE
app.get('/api/profile/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT
        id,
        name,
        email,
        role,
        bio,
        skills,
        location,
        github,
        linkedin,
        resume_name,
        avatar_name,
        is_profile_complete
       FROM users
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Profile not found"
      });
    }

    res.json({
      success: true,
      user: result.rows[0]
    });

  } catch (err) {
    console.error("Get profile error:", err);

    res.status(500).json({
      success: false,
      error: "Database error while fetching profile."
    });
  }
});

// PROJECT APPLICATION ROUTE
app.post('/api/projects/apply', async (req, res) => {
  console.log("🔥 HIT /api/projects/apply ROUTE!", req.body); // <-- Add this line

  const { project_id, user_email, application_type, team_members, cover_note } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO project_applications 
       (project_id, user_email, application_type, team_members, cover_note, status) 
       VALUES ($1, $2, $3, $4, $5, 'Applied') RETURNING *`,
      [project_id, user_email, application_type, team_members, cover_note]
    );

    res.json({ success: true, application: result.rows[0] });
  } catch (err) {
    console.error("Project application error:", err);
    res.status(500).json({ success: false, error: "Database error during application submission." });
  }
});

// START SERVER AT THE VERY BOTTOM
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

