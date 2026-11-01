import express from 'express';
import cors from 'cors';
import pool from './db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';

const app = express();
const JWT_SECRET = process.env.JWT_SECRET;

function requireJwtSecret(res) {
  if (JWT_SECRET) {
    return true;
  }

  res.status(503).json({
    success: false,
    error: 'Authentication is not configured.',
  });
  return false;
}

function createAuthToken(user) {
  return jwt.sign(
    { userId: user.id },
    JWT_SECRET,
    { expiresIn: '1d' }
  );
}

async function requireAuth(req, res, next) {
  if (!JWT_SECRET) {
    return res.status(503).json({
      success: false,
      error: 'Authentication is not configured.',
    });
  }

  const authorization = req.get('authorization') || '';
  const [scheme, token] = authorization.split(' ');
  let authData;

  try {
    authData =
      scheme === 'Bearer' && token
        ? jwt.verify(token, JWT_SECRET)
        : null;
  } catch {
    authData = null;
  }

  if (
    !authData ||
    typeof authData !== 'object' ||
    !Number.isSafeInteger(authData.userId)
  ) {
    return res.status(401).json({
      success: false,
      error: 'Authentication is required.',
    });
  }

  try {
    const result = await pool.query(
      'SELECT id, email, role FROM users WHERE id = $1',
      [authData.userId]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Authentication is invalid.',
      });
    }

    req.user = result.rows[0];
    return next();
  } catch (err) {
    console.error('Authentication lookup error:', err);
    return res.status(500).json({
      success: false,
      error: 'Could not verify authentication.',
    });
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (req.user?.role !== role) {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to access this resource.',
      });
    }

    return next();
  };
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const projectImageUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, callback) => {
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      return callback(
        new Error('Only JPEG, PNG, and WebP images are allowed.')
      );
    }

    callback(null, true);
  },
});

app.use(
  cors({
    origin: [
      "https://proje-x-five.vercel.app",
      "http://localhost:5173"
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
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
  if (!requireJwtSecret(res)) {
    return;
  }

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

    const token = createAuthToken(insertResult.rows[0]);

    res.json({
      success: true,
      user: insertResult.rows[0],
      token,
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
  if (!requireJwtSecret(res)) {
    return;
  }

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

    const token = createAuthToken(user);

    res.json({
      success: true,
      user,
      token,
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

app.post('/api/profile/onboard', requireAuth, async (req, res) => {
  const {
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
        req.user.email
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

app.put('/api/profile/:id', requireAuth, async (req, res) => {
  const { id } = req.params;

  if (Number(id) !== req.user.id) {
    return res.status(403).json({
      success: false,
      error: "You cannot update another user's profile."
    });
  }

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
// PROJECT CREATION AND LISTING
// =====================================================

function handleProjectImageUpload(req, res, next) {
  projectImageUpload.single('image')(req, res, (err) => {
    if (!err) return next();

    return res.status(400).json({
      success: false,
      error: err.code === 'LIMIT_FILE_SIZE'
        ? 'Image must be 5 MB or smaller.'
        : err.message || 'Invalid image upload.',
    });
  });
}

// CREATE PROJECT
app.post(
  '/api/projects',
  requireAuth,
  requireRole('investor'),
  handleProjectImageUpload,
  async (req, res) => {
    console.log("🔥 POST /api/projects HIT");
    const {
      title,
      description,
      budget,
      deadline,
      project_type,
    } = req.body;

    const userId = req.user.id;
    const price = Number(budget);

    if (!Number.isSafeInteger(userId) || userId <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Please log in again before posting a project.',
      });
    }

    if (!title?.trim() || !description?.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Title and description are required.',
      });
    }

    if (
      budget === undefined ||
      budget === '' ||
      !Number.isFinite(price) ||
      price < 0
    ) {
      return res.status(400).json({
        success: false,
        error: 'Enter a valid non-negative budget.',
      });
    }

    try {
      const owner = await pool.query(
        'SELECT id FROM users WHERE id = $1',
        [userId]
      );

      if (owner.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Project Owner account was not found.',
        });
      }

      let imageUrl = null;

      if (req.file) {
        if (
          !process.env.CLOUDINARY_CLOUD_NAME ||
          !process.env.CLOUDINARY_API_KEY ||
          !process.env.CLOUDINARY_API_SECRET
        ) {
          return res.status(503).json({
            success: false,
            error: 'Image storage is not configured yet.',
          });
        }

        const base64Image = req.file.buffer.toString('base64');
        const dataUri =
          `data:${req.file.mimetype};base64,${base64Image}`;

        const uploadedImage = await cloudinary.uploader.upload(
          dataUri,
          {
            folder: 'projex/projects',
            resource_type: 'image',
          }
        );

        imageUrl = uploadedImage.secure_url;
      }

      const category = project_type?.trim() || 'General';

      const result = await pool.query(
        `INSERT INTO projects
          (
            user_id,
            title,
            description,
            meta,
            price,
            deadline,
            project_type,
            image_url
          )
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING
           id, user_id, title, description, meta,
           price, deadline, project_type, image_url, created_at`,
        [
          userId,
          title.trim(),
          description.trim(),
          category,
          price,
          deadline?.trim() || '',
          category,
          imageUrl,
        ]
      );

      return res.status(201).json({
        success: true,
        project: result.rows[0],
      });
    } catch (err) {
      console.error('Create project error:', err);

      return res.status(500).json({
        success: false,
        error: 'Could not create the project. Please try again.',
      });
    }
  }
);

// LIST PROJECTS — for the Student Dashboard
app.get('/api/projects', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         id, user_id, title, description, meta,
         price, deadline, project_type, image_url, created_at
       FROM projects
       ORDER BY created_at DESC, id DESC`
    );

    return res.json({
      success: true,
      projects: result.rows,
    });
  } catch (err) {
    console.error('List projects error:', err);

    return res.status(500).json({
      success: false,
      error: 'Could not load projects.',
    });
  }
});

// GET ONE PROJECT — for project details
app.get('/api/projects/:id', async (req, res) => {
  const projectId = Number(req.params.id);

  if (!Number.isSafeInteger(projectId) || projectId <= 0) {
    return res.status(400).json({
      success: false,
      error: 'Invalid project ID.',
    });
  }

  try {
    const result = await pool.query(
      `SELECT
         id, user_id, title, description, meta,
         price, deadline, project_type, image_url, created_at
       FROM projects
       WHERE id = $1`,
      [projectId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Project not found.',
      });
    }

    return res.json({
      success: true,
      project: result.rows[0],
    });
  } catch (err) {
    console.error('Get project error:', err);

    return res.status(500).json({
      success: false,
      error: 'Could not load project details.',
    });
  }
});

// =====================================================
// PROJECT APPLICATION
// =====================================================

app.post('/api/projects/apply', requireAuth, requireRole('student'), async (req, res) => {
  console.log(
    "🔥 HIT /api/projects/apply ROUTE!",
    req.body
  );

  const {
    project_id,
    application_type,
    cover_note
  } = req.body;

  const projectId = typeof project_id === 'string'
    ? project_id.trim()
    : String(project_id ?? '').trim();
  const applicationType = typeof application_type === 'string'
    ? application_type.trim()
    : '';
  const coverNote = typeof cover_note === 'string'
    ? cover_note.trim()
    : '';

  if (!projectId || !applicationType || !coverNote) {
    return res.status(400).json({
      success: false,
      error: 'Project, application type, and cover note are required.',
    });
  }

  if (applicationType !== 'solo') {
    return res.status(400).json({
      success: false,
      error: 'Only individual solo applications are supported.',
    });
  }

  try {
    const project = await pool.query(
      'SELECT id FROM projects WHERE id::text = $1',
      [projectId]
    );

    if (project.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Project not found.',
      });
    }

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
       VALUES ($1, $2, 'solo', NULL, $3, 'Applied')
       RETURNING *`,
      [
        projectId,
        req.user.email,
        coverNote
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
// PROJECT APPLICATION MANAGEMENT
// =====================================================

// GET APPLICATIONS FOR PROJECTS OWNED BY THE CURRENT OWNER
app.get(
  '/api/owner/applications',
  requireAuth,
  requireRole('investor'),
  async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT
           pa.id AS application_id,
           pa.project_id,
           p.title AS project_title,
           p.description AS project_description,
           p.meta AS project_meta,
           p.price AS project_price,
           p.deadline AS project_deadline,
           p.project_type,
           p.image_url,
           pa.user_email,
           pa.application_type,
           pa.team_members,
           pa.cover_note,
           pa.status,
           pa.created_at
         FROM project_applications pa
         JOIN projects p
           ON p.id::text = pa.project_id
         WHERE p.user_id = $1
         ORDER BY pa.created_at DESC, pa.id DESC`,
        [req.user.id]
      );

      return res.json({
        success: true,
        applications: result.rows,
      });
    } catch (err) {
      console.error('Get owner applications error:', err);

      return res.status(500).json({
        success: false,
        error: 'Could not load applications.',
      });
    }
  }
);

// UPDATE APPLICATION STATUS FOR AN OWNED PROJECT
app.patch(
  '/api/owner/applications/:id',
  requireAuth,
  requireRole('investor'),
  async (req, res) => {
    const applicationId = Number(req.params.id);
    const { status } = req.body;

    if (!Number.isSafeInteger(applicationId) || applicationId <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid application ID.',
      });
    }

    if (status !== 'Accepted' && status !== 'Rejected') {
      return res.status(400).json({
        success: false,
        error: 'Status must be Accepted or Rejected.',
      });
    }

    try {
      const currentApplication = await pool.query(
        `SELECT pa.status
         FROM project_applications pa
         JOIN projects p
           ON p.id::text = pa.project_id
         WHERE pa.id = $1
           AND p.user_id = $2`,
        [applicationId, req.user.id]
      );

      if (currentApplication.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Application not found.',
        });
      }

      if (currentApplication.rows[0].status !== 'Applied') {
        return res.status(400).json({
          success: false,
          error: 'Only Applied applications can be updated.',
        });
      }

      const result = await pool.query(
        `UPDATE project_applications pa
         SET status = $1
         FROM projects p
         WHERE pa.id = $2
           AND p.id::text = pa.project_id
           AND p.user_id = $3
           AND pa.status = 'Applied'
         RETURNING
           pa.id AS application_id,
           pa.project_id,
           pa.user_email,
           pa.application_type,
           pa.team_members,
           pa.cover_note,
           pa.status,
           pa.created_at`,
        [status, applicationId, req.user.id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Application not found.',
        });
      }

      return res.json({
        success: true,
        application: result.rows[0],
      });
    } catch (err) {
      console.error('Update application status error:', err);

      return res.status(500).json({
        success: false,
        error: 'Could not update application status.',
      });
    }
  }
);

// GET APPLICATIONS FOR THE CURRENT STUDENT
app.get(
  '/api/student/applications',
  requireAuth,
  requireRole('student'),
  async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT
           pa.id AS application_id,
           pa.project_id,
           p.title AS project_title,
           p.description AS project_description,
           p.meta AS project_meta,
           p.price AS project_price,
           p.deadline AS project_deadline,
           p.project_type,
           p.image_url,
           pa.user_email,
           pa.application_type,
           pa.team_members,
           pa.cover_note,
           pa.status,
           pa.created_at
         FROM project_applications pa
         JOIN projects p
           ON p.id::text = pa.project_id
         WHERE pa.user_email = $1
         ORDER BY pa.created_at DESC, pa.id DESC`,
        [req.user.email]
      );

      return res.json({
        success: true,
        applications: result.rows,
      });
    } catch (err) {
      console.error('Get student applications error:', err);

      return res.status(500).json({
        success: false,
        error: 'Could not load applications.',
      });
    }
  }
);

// =====================================================
// MESSAGING: SHARED CONVERSATIONS AND MESSAGES
// =====================================================

function validUserId(value) {
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

// GET INBOX
app.get('/api/messages/conversations', requireAuth, async (req, res) => {
  const userId = req.user.id;

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
app.post('/api/messages/conversations', requireAuth, async (req, res) => {
  const userId = req.user.id;
  const otherUserId = validUserId(req.body.otherUserId);

  if (!otherUserId || userId === otherUserId) {
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
app.get('/api/messages/conversations/:id', requireAuth, async (req, res) => {
  const conversationId = validUserId(req.params.id);
  const userId = req.user.id;

  if (!conversationId) {
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
app.post('/api/messages', requireAuth, async (req, res) => {
  const senderId = req.user.id;
  const conversationId = validUserId(req.body.conversationId);
  const body = typeof req.body.body === "string"
    ? req.body.body.trim()
    : "";

  if (!conversationId || !body) {
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


/* GET ALL PROJECTS */
app.get("/api/projects", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        user_id,
        title,
        description,
        meta,
        price,
        deadline,
        project_type,
        image_url,
        created_at
      FROM projects
      ORDER BY created_at DESC, id DESC
    `);

    res.json({
      success: true,
      projects: result.rows,
    });
  } catch (error) {
    console.error("Fetch projects error:", error);

    res.status(500).json({
      success: false,
      error: "Could not load projects.",
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