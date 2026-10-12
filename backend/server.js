import express from 'express';
import cors from 'cors';
import pool from './db.js';
import bcrypt from 'bcrypt';

const app = express();

app.use(
  cors({
    origin: [
      "https://proje-x-five.vercel.app",
      "http://localhost:5173"
    ],
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
// MESSAGING: SHARED CONVERSATIONS AND MESSAGES
// =====================================================

function validUserId(value) {
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

// GET INBOX
app.get('/api/messages/conversations', async (req, res) => {
  const userId = validUserId(req.query.userId);

  if (!userId) {
    return res.status(400).json({
      success: false,
      error: "A valid userId is required."
    });
  }

  try {
    const result = await pool.query(
      `SELECT
         c.id,
         c.updated_at,
         other.id AS other_user_id,
         other.name AS other_name,
         other.role AS other_role,
         other.position AS other_position,
         other.avatar_name AS other_avatar,
         latest.body AS last_message,
         latest.created_at AS last_message_at,
         (
           SELECT COUNT(*)::int
           FROM messages m
           WHERE m.conversation_id = c.id
             AND m.sender_id <> $1
             AND m.read_at IS NULL
         ) AS unread_count
       FROM conversations c
       JOIN users other
         ON other.id = CASE
           WHEN c.user_one_id = $1 THEN c.user_two_id
           ELSE c.user_one_id
         END
       LEFT JOIN LATERAL (
         SELECT body, created_at
         FROM messages
         WHERE conversation_id = c.id
         ORDER BY created_at DESC, id DESC
         LIMIT 1
       ) latest ON TRUE
       WHERE c.user_one_id = $1 OR c.user_two_id = $1
       ORDER BY COALESCE(latest.created_at, c.created_at) DESC`,
      [userId]
    );

    res.json({
      success: true,
      conversations: result.rows
    });
  } catch (err) {
    console.error("Get conversations error:", err);
    res.status(500).json({
      success: false,
      error: "Could not load conversations."
    });
  }
});


// START OR REUSE A CONVERSATION
app.post('/api/messages/conversations', async (req, res) => {
  const userId = validUserId(req.body.userId);
  const otherUserId = validUserId(req.body.otherUserId);

  if (!userId || !otherUserId || userId === otherUserId) {
    return res.status(400).json({
      success: false,
      error: "Two different valid user IDs are required."
    });
  }

  const userOneId = Math.min(userId, otherUserId);
  const userTwoId = Math.max(userId, otherUserId);

  try {
    const users = await pool.query(
      `SELECT id FROM users WHERE id = ANY($1::int[])`,
      [[userOneId, userTwoId]]
    );

    if (users.rows.length !== 2) {
      return res.status(404).json({
        success: false,
        error: "One or both users do not exist."
      });
    }

    const result = await pool.query(
      `INSERT INTO conversations (user_one_id, user_two_id)
       VALUES ($1, $2)
       ON CONFLICT (user_one_id, user_two_id)
       DO UPDATE SET user_one_id = EXCLUDED.user_one_id
       RETURNING id, user_one_id, user_two_id, created_at`,
      [userOneId, userTwoId]
    );

    res.json({
      success: true,
      conversation: result.rows[0]
    });
  } catch (err) {
    console.error("Start conversation error:", err);
    res.status(500).json({
      success: false,
      error: "Could not start the conversation."
    });
  }
});


// GET MESSAGE HISTORY AND MARK RECEIVED MESSAGES AS READ
app.get('/api/messages/conversations/:id', async (req, res) => {
  const conversationId = validUserId(req.params.id);
  const userId = validUserId(req.query.userId);

  if (!conversationId || !userId) {
    return res.status(400).json({
      success: false,
      error: "Valid conversation and user IDs are required."
    });
  }

  try {
    const access = await pool.query(
      `SELECT id
       FROM conversations
       WHERE id = $1
         AND (user_one_id = $2 OR user_two_id = $2)`,
      [conversationId, userId]
    );

    if (access.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Conversation not found."
      });
    }

    await pool.query(
      `UPDATE messages
       SET read_at = NOW()
       WHERE conversation_id = $1
         AND sender_id <> $2
         AND read_at IS NULL`,
      [conversationId, userId]
    );

    const result = await pool.query(
      `SELECT id, conversation_id, sender_id, body, created_at, read_at
       FROM messages
       WHERE conversation_id = $1
       ORDER BY created_at ASC, id ASC`,
      [conversationId]
    );

    res.json({
      success: true,
      messages: result.rows
    });
  } catch (err) {
    console.error("Get message history error:", err);
    res.status(500).json({
      success: false,
      error: "Could not load messages."
    });
  }
});


// SEND MESSAGE
app.post('/api/messages', async (req, res) => {
  const senderId = validUserId(req.body.senderId);
  const conversationId = validUserId(req.body.conversationId);
  const body = typeof req.body.body === "string"
    ? req.body.body.trim()
    : "";

  if (!senderId || !conversationId || !body) {
    return res.status(400).json({
      success: false,
      error: "Sender, conversation, and message text are required."
    });
  }

  if (body.length > 5000) {
    return res.status(400).json({
      success: false,
      error: "Messages cannot exceed 5000 characters."
    });
  }

  try {
    const access = await pool.query(
      `SELECT id
       FROM conversations
       WHERE id = $1
         AND (user_one_id = $2 OR user_two_id = $2)`,
      [conversationId, senderId]
    );

    if (access.rows.length === 0) {
      return res.status(403).json({
        success: false,
        error: "You cannot send messages in this conversation."
      });
    }

    const result = await pool.query(
      `INSERT INTO messages (conversation_id, sender_id, body)
       VALUES ($1, $2, $3)
       RETURNING id, conversation_id, sender_id, body, created_at, read_at`,
      [conversationId, senderId, body]
    );

    await pool.query(
      `UPDATE conversations SET updated_at = NOW() WHERE id = $1`,
      [conversationId]
    );

    res.status(201).json({
      success: true,
      message: result.rows[0]
    });
  } catch (err) {
    console.error("Send message error:", err);
    res.status(500).json({
      success: false,
      error: "Could not send message."
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