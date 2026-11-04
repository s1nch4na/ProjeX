import express from 'express';
import cors from 'cors';
import pool from './db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { OAuth2Client } from 'google-auth-library';

const app = express();
const JWT_SECRET = process.env.JWT_SECRET;
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const PROFESSIONAL_CATEGORIES = [
  'Technology',
  'Creative & Design',
  'Business',
  'Marketing',
  'Data & Analytics',
  'Writing & Content',
  'Finance',
  'Engineering',
  'Media & Production',
  'Research',
];

function normalizeProfessionalCategories(value) {
  if (!Array.isArray(value)) return [];

  return [...new Set(value)]
    .filter((category) => typeof category === 'string')
    .map((category) => category.trim())
    .filter((category) => PROFESSIONAL_CATEGORIES.includes(category));
}

function hasInvalidProfessionalCategory(value) {
  return Array.isArray(value) &&
    value.some(
      (category) =>
        typeof category !== 'string' ||
        !PROFESSIONAL_CATEGORIES.includes(category.trim())
    );
}

const PROFILE_RETURNING_COLUMNS = `
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
  professional_categories,
  is_profile_complete
`;
const AUTH_RETURNING_COLUMNS = `
  ${PROFILE_RETURNING_COLUMNS},
  COALESCE(is_admin, false) AS is_admin
`;

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
      'SELECT id, email, role, google_subject, COALESCE(is_admin, false) AS is_admin FROM users WHERE id = $1',
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

function requireAdmin(req, res, next) {
  const allowedEmails = new Set(
    (process.env.ADMIN_EMAILS || '')
      .split(',')
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean)
  );

  if (
    !req.user?.google_subject ||
    !req.user?.email ||
    !allowedEmails.has(req.user.email.trim().toLowerCase())
  ) {
    if (req.user?.id) {
      pool.query(
        'UPDATE users SET is_admin = false WHERE id = $1 AND is_admin = true',
        [req.user.id]
      ).catch((error) => console.error('Admin permission synchronization error:', error));
    }
    return res.status(403).json({
      success: false,
      error: 'Administrator permission is required.',
    });
  }

  if (!req.user.is_admin) {
    pool.query(
      'UPDATE users SET is_admin = true WHERE id = $1',
      [req.user.id]
    ).catch((error) => console.error('Admin permission synchronization error:', error));
  }

  return next();
}

function challengeStatus(challenge) {
  if (challenge.status === 'Closed') return 'Closed';
  const now = Date.now();
  const start = new Date(challenge.start_at).getTime();
  const deadline = new Date(challenge.deadline_at).getTime();

  if (Number.isNaN(start) || Number.isNaN(deadline)) return 'Draft';
  if (now < start) return challenge.status === 'Draft' ? 'Draft' : 'Upcoming';
  if (now <= deadline) return 'Active';
  return 'Closed';
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
      "http://localhost:5173",
      "http://127.0.0.1:5173"
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
  return res.status(410).json({
    success: false,
    error: 'New accounts must be created with Google Sign-In.',
  });
});

// =====================================================
// GOOGLE SIGN-IN
// =====================================================

app.post('/api/auth/google', async (req, res) => {
  if (!requireJwtSecret(res)) {
    return;
  }

  const { credential, role } = req.body;
  if (typeof credential !== 'string' || !credential.trim()) {
    return res.status(400).json({
      success: false,
      error: 'A Google identity credential is required.',
    });
  }
  if (role !== undefined && role !== 'student' && role !== 'investor') {
    return res.status(400).json({
      success: false,
      error: 'Account role must be student or investor.',
    });
  }
  if (!process.env.GOOGLE_CLIENT_ID) {
    return res.status(503).json({
      success: false,
      error: 'Google authentication is not configured.',
    });
  }

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const googleSubject = payload?.sub;
    const email = payload?.email?.trim().toLowerCase();
    const name = payload?.name?.trim() || email?.split('@')[0];

    if (!googleSubject || !email || payload.email_verified !== true || !name) {
      return res.status(401).json({
        success: false,
        error: 'The Google account could not be verified.',
      });
    }

    const allowedEmails = new Set(
      (process.env.ADMIN_EMAILS || '')
        .split(',')
        .map((value) => value.trim().toLowerCase())
        .filter(Boolean)
    );
    const isAdmin = allowedEmails.has(email);

    let userResult = await pool.query(
      'SELECT * FROM users WHERE google_subject = $1',
      [googleSubject]
    );

    if (userResult.rows.length === 0) {
      userResult = await pool.query(
        'SELECT * FROM users WHERE LOWER(email) = $1',
        [email]
      );
    }

    if (userResult.rows.length > 0) {
      const existingUser = userResult.rows[0];
      userResult = await pool.query(
        `UPDATE users
         SET email = $1,
             google_subject = $2,
             is_admin = $3,
             name = CASE WHEN COALESCE(TRIM(name), '') = '' THEN $4 ELSE name END
         WHERE id = $5
         RETURNING ${AUTH_RETURNING_COLUMNS}`,
        [email, googleSubject, isAdmin, name, existingUser.id]
      );
    } else {
      userResult = await pool.query(
        `INSERT INTO users
           (email, name, role, google_subject, is_admin, is_profile_complete)
         VALUES ($1, $2, $3, $4, $5, false)
           RETURNING ${AUTH_RETURNING_COLUMNS}`,
        [email, name, role || 'student', googleSubject, isAdmin]
      );
    }

    const user = userResult.rows[0];
    return res.json({
      success: true,
      user,
      token: createAuthToken(user),
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({
        success: false,
        error: 'That Google account is already linked to another account.',
      });
    }
    console.error('Google authentication error:', error);
    return res.status(401).json({
      success: false,
      error: 'Google authentication failed.',
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

  if (
    typeof email !== 'string' ||
    !email.trim() ||
    typeof password !== 'string' ||
    !password
  ) {
    return res.status(400).json({
      success: false,
      error: 'Email and password are required.',
    });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email.trim()]
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
    interests,
    professional_categories
  } = req.body;
  if (hasInvalidProfessionalCategory(professional_categories)) {
    return res.status(400).json({
      success: false,
      error: 'One or more professional categories are invalid.',
    });
  }
  const categories = normalizeProfessionalCategories(professional_categories);

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
         professional_categories = $14,
         is_profile_complete = true
       WHERE email = $15
       RETURNING ${PROFILE_RETURNING_COLUMNS}`,
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
        categories,
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
        professional_categories,
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
    interests,
    professional_categories
  } = req.body;
  if (hasInvalidProfessionalCategory(professional_categories)) {
    return res.status(400).json({
      success: false,
      error: 'One or more professional categories are invalid.',
    });
  }
  const categories = normalizeProfessionalCategories(professional_categories);

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
         interests = $11,
         professional_categories = $12
       WHERE id = $13
       RETURNING ${PROFILE_RETURNING_COLUMNS}`,
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
        categories,
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

// =====================================================
// WEEKLY CHALLENGES
// =====================================================

const challengeSelect = `
  c.id,
  c.title,
  c.summary,
  c.description,
  c.category,
  c.cover_image_url,
  c.start_at,
  c.deadline_at,
  c.status,
  c.rules,
  c.submission_requirements,
  c.created_by,
  c.created_at,
  c.updated_at,
  COUNT(cs.id)::int AS submission_count
`;

app.get('/api/challenges', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT ${challengeSelect}
       FROM challenges c
       LEFT JOIN challenge_submissions cs
         ON cs.challenge_id = c.id AND cs.is_public = true
       WHERE c.status <> 'Draft'
       GROUP BY c.id
       ORDER BY c.start_at DESC, c.created_at DESC`
    );

    return res.json({
      success: true,
      challenges: result.rows.map((challenge) => ({
        ...challenge,
        status: challengeStatus(challenge),
      })),
    });
  } catch (error) {
    console.error('List challenges error:', error);
    return res.status(500).json({
      success: false,
      error: 'Could not load challenges.',
    });
  }
});

app.get('/api/challenges/:id', async (req, res) => {
  const challengeId = Number(req.params.id);
  if (!Number.isSafeInteger(challengeId) || challengeId <= 0) {
    return res.status(400).json({ success: false, error: 'Invalid challenge ID.' });
  }

  try {
    const result = await pool.query(
      `SELECT ${challengeSelect}
       FROM challenges c
       LEFT JOIN challenge_submissions cs
         ON cs.challenge_id = c.id AND cs.is_public = true
       WHERE c.id = $1 AND c.status <> 'Draft'
       GROUP BY c.id`,
      [challengeId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Challenge not found.' });
    }

    const challenge = result.rows[0];
    const submissions = await pool.query(
      `SELECT
         cs.id AS submission_id,
         cs.project_title,
         cs.description,
         cs.external_link,
         cs.repository_link,
         cs.preview_image_url,
         cs.is_featured,
         cs.is_winner,
         cs.created_at,
         u.id AS student_id,
         u.name AS student_name
       FROM challenge_submissions cs
       JOIN users u ON u.id = cs.student_id
       WHERE cs.challenge_id = $1 AND cs.is_public = true
       ORDER BY cs.is_winner DESC, cs.is_featured DESC, cs.created_at DESC`,
      [challengeId]
    );

    return res.json({
      success: true,
      challenge: { ...challenge, status: challengeStatus(challenge) },
      submissions: submissions.rows,
    });

  } catch (error) {
    console.error('Get challenge error:', error);
    return res.status(500).json({ success: false, error: 'Could not load challenge.' });
  }
});

app.get('/api/challenges/:id/my-submission', requireAuth, requireRole('student'), async (req, res) => {
  const challengeId = Number(req.params.id);
  try {
    const result = await pool.query(
      `SELECT * FROM challenge_submissions
       WHERE challenge_id=$1 AND student_id=$2`,
      [challengeId, req.user.id]
    );
    return res.json({ success: true, submission: result.rows[0] || null });
  } catch (error) {
    console.error('Get own challenge submission error:', error);
    return res.status(500).json({ success: false, error: 'Could not load your submission.' });
  }
});

app.get('/api/admin/challenges', requireAuth, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT ${challengeSelect}
       FROM challenges c
       LEFT JOIN challenge_submissions cs ON cs.challenge_id = c.id
       GROUP BY c.id
       ORDER BY c.created_at DESC`
    );
    return res.json({
      success: true,
      challenges: result.rows.map((challenge) => ({
        ...challenge,
        status: challengeStatus(challenge),
      })),
    });
  } catch (error) {
    console.error('Admin challenge list error:', error);
    return res.status(500).json({ success: false, error: 'Could not load admin challenges.' });
  }
});

app.post('/api/admin/challenges', requireAuth, requireAdmin, async (req, res) => {
  const {
    title,
    summary,
    description,
    category,
    cover_image_url,
    start_at,
    deadline_at,
    status = 'Draft',
    rules,
    submission_requirements,
  } = req.body;

  if (
    typeof title !== 'string' ||
    !title.trim() ||
    typeof description !== 'string' ||
    !description.trim() ||
    !start_at ||
    !deadline_at ||
    !['Draft', 'Upcoming'].includes(status)
  ) {
    return res.status(400).json({
      success: false,
      error: 'Title, description, dates, and a valid draft status are required.',
    });
  }

  if (new Date(deadline_at) <= new Date(start_at)) {
    return res.status(400).json({ success: false, error: 'Deadline must be after the start date.' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO challenges
       (title, summary, description, category, cover_image_url, start_at,
        deadline_at, status, rules, submission_requirements, created_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       RETURNING *`,
      [
        title.trim(),
        summary?.trim() || null,
        description.trim(),
        category?.trim() || null,
        cover_image_url?.trim() || null,
        start_at,
        deadline_at,
        status,
        rules?.trim() || null,
        submission_requirements?.trim() || null,
        req.user.id,
      ]
    );
    return res.status(201).json({ success: true, challenge: result.rows[0] });
  } catch (error) {
    console.error('Create challenge error:', error);
    return res.status(500).json({ success: false, error: 'Could not create challenge.' });
  }
});

app.put('/api/admin/challenges/:id', requireAuth, requireAdmin, async (req, res) => {
  const challengeId = Number(req.params.id);
  const {
    title,
    summary,
    description,
    category,
    cover_image_url,
    start_at,
    deadline_at,
    status,
    rules,
    submission_requirements,
  } = req.body;

  if (!Number.isSafeInteger(challengeId) || challengeId <= 0) {
    return res.status(400).json({ success: false, error: 'Invalid challenge ID.' });
  }
  if (!['Draft', 'Upcoming'].includes(status)) {
    return res.status(400).json({ success: false, error: 'Only draft or upcoming status can be edited.' });
  }

  try {
    const result = await pool.query(
      `UPDATE challenges
       SET title=$1, summary=$2, description=$3, category=$4, cover_image_url=$5,
           start_at=$6, deadline_at=$7, status=$8, rules=$9,
           submission_requirements=$10, updated_at=NOW()
       WHERE id=$11
       RETURNING *`,
      [
        title?.trim(),
        summary?.trim() || null,
        description?.trim(),
        category?.trim() || null,
        cover_image_url?.trim() || null,
        start_at,
        deadline_at,
        status,
        rules?.trim() || null,
        submission_requirements?.trim() || null,
        challengeId,
      ]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Challenge not found.' });
    }
    return res.json({ success: true, challenge: result.rows[0] });
  } catch (error) {
    console.error('Update challenge error:', error);
    return res.status(500).json({ success: false, error: 'Could not update challenge.' });
  }
});

app.patch('/api/admin/challenges/:id/status', requireAuth, requireAdmin, async (req, res) => {
  const challengeId = Number(req.params.id);
  const { status } = req.body;
  if (!Number.isSafeInteger(challengeId) || !['Upcoming', 'Closed'].includes(status)) {
    return res.status(400).json({ success: false, error: 'Invalid challenge status.' });
  }

  try {
    const result = await pool.query(
      `UPDATE challenges SET status=$1, updated_at=NOW()
       WHERE id=$2 RETURNING *`,
      [status, challengeId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Challenge not found.' });
    }
    return res.json({ success: true, challenge: result.rows[0] });
  } catch (error) {
    console.error('Update challenge status error:', error);
    return res.status(500).json({ success: false, error: 'Could not update challenge status.' });
  }
});

app.get('/api/admin/challenges/:id/submissions', requireAuth, requireAdmin, async (req, res) => {
  const challengeId = Number(req.params.id);
  try {
    const result = await pool.query(
      `SELECT cs.*, u.name AS student_name, u.email AS student_email
       FROM challenge_submissions cs
       JOIN users u ON u.id = cs.student_id
       WHERE cs.challenge_id=$1
       ORDER BY cs.created_at DESC`,
      [challengeId]
    );
    return res.json({ success: true, submissions: result.rows });
  } catch (error) {
    console.error('Admin submissions error:', error);
    return res.status(500).json({ success: false, error: 'Could not load submissions.' });
  }
});

app.patch('/api/admin/challenge-submissions/:id', requireAuth, requireAdmin, async (req, res) => {
  const submissionId = Number(req.params.id);
  const { is_featured, is_winner, is_public, admin_note } = req.body;
  if (!Number.isSafeInteger(submissionId)) {
    return res.status(400).json({ success: false, error: 'Invalid submission ID.' });
  }

  try {
    const result = await pool.query(
      `UPDATE challenge_submissions
       SET is_featured=COALESCE($1,is_featured),
           is_winner=COALESCE($2,is_winner),
           is_public=COALESCE($3,is_public),
           admin_note=COALESCE($4,admin_note),
           reviewed_by=$5, reviewed_at=NOW(), updated_at=NOW()
       WHERE id=$6
       RETURNING *`,
      [
        typeof is_featured === 'boolean' ? is_featured : null,
        typeof is_winner === 'boolean' ? is_winner : null,
        typeof is_public === 'boolean' ? is_public : null,
        typeof admin_note === 'string' ? admin_note.trim() : null,
        req.user.id,
        submissionId,
      ]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Submission not found.' });
    }
    return res.json({ success: true, submission: result.rows[0] });
  } catch (error) {
    console.error('Review submission error:', error);
    return res.status(500).json({ success: false, error: 'Could not review submission.' });
  }
});

app.post('/api/challenges/:id/submissions', requireAuth, requireRole('student'), async (req, res) => {
  const challengeId = Number(req.params.id);
  const { project_title, description, external_link, repository_link, preview_image_url } = req.body;

  if (!Number.isSafeInteger(challengeId) || !project_title?.trim() || !description?.trim()) {
    return res.status(400).json({ success: false, error: 'Project title and description are required.' });
  }

  try {
    const challengeResult = await pool.query(
      `SELECT id, status, start_at, deadline_at FROM challenges WHERE id=$1`,
      [challengeId]
    );
    if (challengeResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Challenge not found.' });
    }
    const challenge = challengeResult.rows[0];
    const status = challengeStatus(challenge);
    if (status !== 'Active') {
      return res.status(400).json({ success: false, error: 'Submissions are not currently open.' });
    }

    const result = await pool.query(
      `INSERT INTO challenge_submissions
       (challenge_id, student_id, project_title, description, external_link,
        repository_link, preview_image_url)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING *`,
      [
        challengeId,
        req.user.id,
        project_title.trim(),
        description.trim(),
        external_link?.trim() || null,
        repository_link?.trim() || null,
        preview_image_url?.trim() || null,
      ]
    );
    return res.status(201).json({ success: true, submission: result.rows[0] });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ success: false, error: 'You already submitted to this challenge.' });
    }
    console.error('Create challenge submission error:', error);
    return res.status(500).json({ success: false, error: 'Could not submit work.' });
  }
});

app.put('/api/challenge-submissions/:id', requireAuth, requireRole('student'), async (req, res) => {
  const submissionId = Number(req.params.id);
  const { project_title, description, external_link, repository_link, preview_image_url } = req.body;
  try {
    const result = await pool.query(
      `UPDATE challenge_submissions cs
       SET project_title=$1, description=$2, external_link=$3,
           repository_link=$4, preview_image_url=$5, updated_at=NOW()
       FROM challenges c
       WHERE cs.id=$6 AND cs.challenge_id=c.id AND cs.student_id=$7
         AND c.status <> 'Closed' AND NOW() <= c.deadline_at
       RETURNING cs.*`,
      [
        project_title?.trim(),
        description?.trim(),
        external_link?.trim() || null,
        repository_link?.trim() || null,
        preview_image_url?.trim() || null,
        submissionId,
        req.user.id,
      ]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Submission not found or editing is closed.' });
    }
    return res.json({ success: true, submission: result.rows[0] });
  } catch (error) {
    console.error('Update challenge submission error:', error);
    return res.status(500).json({ success: false, error: 'Could not update submission.' });
  }
});

// =====================================================
// MANUAL PAYMENT TRACKING
// =====================================================

const paymentSelect = `
  pm.id AS payment_id,
  pm.application_id,
  pm.project_id,
  pm.student_id,
  pm.owner_id,
  pm.amount,
  pm.currency,
  pm.payment_method,
  pm.transaction_reference,
  pm.payment_date,
  pm.status,
  pm.created_at,
  pm.updated_at,
  pm.student_confirmed_at,
  pm.dispute_reason,
  p.title AS project_title,
  student.name AS student_name,
  student.email AS student_email,
  owner.name AS owner_name,
  owner.email AS owner_email
`;

function validPaymentAmount(value) {
  const amount = Number(value);
  return Number.isFinite(amount) && amount > 0 && amount <= 100000000 && /^\d+(\.\d{1,2})?$/.test(String(value).trim());
}

function validPaymentMethod(value) {
  return ['UPI', 'Bank Transfer', 'Other'].includes(value);
}

async function getOwnedAcceptedApplication(applicationId, ownerId) {
  const result = await pool.query(
    `SELECT
       pa.id AS application_id,
       pa.project_id,
       pa.user_email,
       p.user_id AS owner_id,
       p.title AS project_title,
       student.id AS student_id
     FROM project_applications pa
     JOIN projects p ON p.id::text = pa.project_id
     JOIN users student ON LOWER(student.email) = LOWER(pa.user_email)
     WHERE pa.id = $1
       AND pa.status = 'Accepted'
       AND p.user_id = $2`,
    [applicationId, ownerId]
  );
  return result.rows[0] || null;
}

app.post('/api/owner/payments', requireAuth, requireRole('investor'), async (req, res) => {
  const applicationId = Number(req.body.application_id);
  const {
    amount,
    payment_method: paymentMethod,
    transaction_reference: transactionReference,
    payment_date: paymentDate,
  } = req.body;

  if (!Number.isSafeInteger(applicationId) || applicationId <= 0) {
    return res.status(400).json({ success: false, error: 'A valid accepted application is required.' });
  }
  if (!validPaymentAmount(amount)) {
    return res.status(400).json({ success: false, error: 'Amount must be a positive value with up to two decimals.' });
  }
  if (!validPaymentMethod(paymentMethod)) {
    return res.status(400).json({ success: false, error: 'Payment method must be UPI, Bank Transfer, or Other.' });
  }
  if (typeof transactionReference !== 'string' || !transactionReference.trim() || transactionReference.trim().length > 160) {
    return res.status(400).json({ success: false, error: 'A transaction reference of 160 characters or fewer is required.' });
  }
  if (!paymentDate || Number.isNaN(new Date(paymentDate).getTime())) {
    return res.status(400).json({ success: false, error: 'A valid payment date is required.' });
  }

  try {
    const application = await getOwnedAcceptedApplication(applicationId, req.user.id);
    if (!application) {
      return res.status(404).json({ success: false, error: 'Accepted application not found.' });
    }

    const result = await pool.query(
      `WITH inserted AS (
         INSERT INTO payments
           (application_id, project_id, student_id, owner_id, amount, currency,
            payment_method, transaction_reference, payment_date, status)
         VALUES ($1,$2,$3,$4,$5,'INR',$6,$7,$8,'Awaiting Confirmation')
         RETURNING *
       )
       SELECT ${paymentSelect}
       FROM inserted pm
       JOIN projects p ON p.id = pm.project_id
       JOIN users student ON student.id = pm.student_id
       JOIN users owner ON owner.id = pm.owner_id`,
      [
        application.application_id,
        Number(application.project_id),
        application.student_id,
        req.user.id,
        Number(amount).toFixed(2),
        paymentMethod,
        transactionReference.trim(),
        paymentDate,
      ]
    );

    await pool.query(
      `INSERT INTO payment_status_history
       (payment_id, from_status, to_status, changed_by)
       VALUES ($1, NULL, 'Awaiting Confirmation', $2)`,
      [result.rows[0].payment_id, req.user.id]
    );

    return res.status(201).json({ success: true, payment: result.rows[0] });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ success: false, error: 'That transaction reference is already recorded.' });
    }
    console.error('Record payment error:', error);
    return res.status(500).json({ success: false, error: 'Could not record payment.' });
  }
});

app.get('/api/owner/payments', requireAuth, requireRole('investor'), async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT ${paymentSelect}
       FROM payments pm
       JOIN projects p ON p.id = pm.project_id AND p.user_id = $1
       JOIN users student ON student.id = pm.student_id
       JOIN users owner ON owner.id = pm.owner_id
       WHERE pm.owner_id = $1
       ORDER BY pm.created_at DESC, pm.id DESC`,
      [req.user.id]
    );
    return res.json({ success: true, payments: result.rows });
  } catch (error) {
    console.error('Get owner payments error:', error);
    return res.status(500).json({ success: false, error: 'Could not load payments.' });
  }
});

app.get('/api/owner/payments/:id', requireAuth, requireRole('investor'), async (req, res) => {
  const paymentId = Number(req.params.id);
  try {
    const result = await pool.query(
      `SELECT ${paymentSelect}
       FROM payments pm
       JOIN projects p ON p.id = pm.project_id AND p.user_id = $1
       JOIN users student ON student.id = pm.student_id
       JOIN users owner ON owner.id = pm.owner_id
       WHERE pm.id = $2 AND pm.owner_id = $1`,
      [req.user.id, paymentId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Payment not found.' });
    }
    return res.json({ success: true, payment: result.rows[0] });
  } catch (error) {
    console.error('Get owner payment error:', error);
    return res.status(500).json({ success: false, error: 'Could not load payment.' });
  }
});

app.get('/api/student/payments', requireAuth, requireRole('student'), async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT ${paymentSelect}
       FROM payments pm
       JOIN projects p ON p.id = pm.project_id
       JOIN users student ON student.id = pm.student_id AND student.id = $1
       JOIN users owner ON owner.id = pm.owner_id
       ORDER BY pm.created_at DESC, pm.id DESC`,
      [req.user.id]
    );
    return res.json({ success: true, payments: result.rows });
  } catch (error) {
    console.error('Get student payments error:', error);
    return res.status(500).json({ success: false, error: 'Could not load payments.' });
  }
});

app.get('/api/student/payments/:id', requireAuth, requireRole('student'), async (req, res) => {
  const paymentId = Number(req.params.id);
  try {
    const result = await pool.query(
      `SELECT ${paymentSelect}
       FROM payments pm
       JOIN projects p ON p.id = pm.project_id
       JOIN users student ON student.id = pm.student_id AND student.id = $1
       JOIN users owner ON owner.id = pm.owner_id
       WHERE pm.id = $2`,
      [req.user.id, paymentId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Payment not found.' });
    }
    return res.json({ success: true, payment: result.rows[0] });
  } catch (error) {
    console.error('Get student payment error:', error);
    return res.status(500).json({ success: false, error: 'Could not load payment.' });
  }
});

async function changeStudentPaymentStatus(req, res, status) {
  const paymentId = Number(req.params.id);
  const disputeReason = typeof req.body?.reason === 'string'
    ? req.body.reason.trim()
    : null;

  if (!Number.isSafeInteger(paymentId) || paymentId <= 0) {
    return res.status(400).json({ success: false, error: 'Invalid payment ID.' });
  }
  if (status === 'Disputed' && !disputeReason) {
    return res.status(400).json({ success: false, error: 'A dispute reason is required.' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const current = await client.query(
      `SELECT id, status
       FROM payments
       WHERE id = $1 AND student_id = $2
       FOR UPDATE`,
      [paymentId, req.user.id]
    );
    if (current.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ success: false, error: 'Payment not found.' });
    }
    if (current.rows[0].status !== 'Awaiting Confirmation') {
      await client.query('ROLLBACK');
      return res.status(400).json({ success: false, error: 'Only awaiting payments can be updated.' });
    }

    const result = await client.query(
      `UPDATE payments
       SET status = $1,
           dispute_reason = CASE WHEN $1 = 'Disputed' THEN $2 ELSE dispute_reason END,
           student_confirmed_at = CASE WHEN $1 = 'Completed' THEN NOW() ELSE student_confirmed_at END,
           updated_at = NOW()
       WHERE id = $3
       RETURNING *`,
      [status, disputeReason, paymentId]
    );
    await client.query(
      `INSERT INTO payment_status_history
       (payment_id, from_status, to_status, changed_by)
       VALUES ($1, $2, $3, $4)`,
      [paymentId, current.rows[0].status, status, req.user.id]
    );
    await client.query('COMMIT');
    return res.json({ success: true, payment: result.rows[0] });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Student payment status error:', error);
    return res.status(500).json({ success: false, error: 'Could not update payment status.' });
  } finally {
    client.release();
  }
}

app.patch('/api/student/payments/:id/confirm', requireAuth, requireRole('student'), (req, res) =>
  changeStudentPaymentStatus(req, res, 'Completed')
);

app.patch('/api/student/payments/:id/dispute', requireAuth, requireRole('student'), (req, res) =>
  changeStudentPaymentStatus(req, res, 'Disputed')
);

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
           u.name AS applicant_name,
           pa.user_email,
           pa.application_type,
           pa.team_members,
           pa.cover_note,
           pa.status,
           pa.created_at
         FROM project_applications pa
         JOIN projects p
           ON p.id::text = pa.project_id
         LEFT JOIN users u
           ON LOWER(u.email) = LOWER(pa.user_email)
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


// =====================================================
// SERVER
// =====================================================

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await pool.query(
      `ALTER TABLE users
       ADD COLUMN IF NOT EXISTS google_subject TEXT`
    );
    await pool.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS users_google_subject_unique
      ON users (google_subject)
      WHERE google_subject IS NOT NULL
    `);
    await pool.query(
      `ALTER TABLE users
       ALTER COLUMN password_hash DROP NOT NULL`
    );
    await pool.query(
      `ALTER TABLE users
       ADD COLUMN IF NOT EXISTS professional_categories TEXT[] NOT NULL DEFAULT '{}'`
    );
    await pool.query(
      `ALTER TABLE users
       ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT false`
    );
    await pool.query(`
      CREATE TABLE IF NOT EXISTS challenges (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        summary TEXT,
        description TEXT NOT NULL,
        category TEXT,
        cover_image_url TEXT,
        start_at TIMESTAMPTZ NOT NULL,
        deadline_at TIMESTAMPTZ NOT NULL,
        status TEXT NOT NULL DEFAULT 'Draft'
          CHECK (status IN ('Draft', 'Upcoming', 'Closed')),
        rules TEXT,
        submission_requirements TEXT,
        created_by INTEGER NOT NULL REFERENCES users(id),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CHECK (deadline_at > start_at)
      )
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS challenge_submissions (
        id SERIAL PRIMARY KEY,
        challenge_id INTEGER NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
        student_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        project_title TEXT NOT NULL,
        description TEXT NOT NULL,
        external_link TEXT,
        repository_link TEXT,
        preview_image_url TEXT,
        is_public BOOLEAN NOT NULL DEFAULT true,
        is_featured BOOLEAN NOT NULL DEFAULT false,
        is_winner BOOLEAN NOT NULL DEFAULT false,
        admin_note TEXT,
        reviewed_by INTEGER REFERENCES users(id),
        reviewed_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE (challenge_id, student_id)
      )
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        application_id INTEGER NOT NULL REFERENCES project_applications(id) ON DELETE RESTRICT,
        project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE RESTRICT,
        student_id INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
        owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
        amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
        currency TEXT NOT NULL DEFAULT 'INR' CHECK (currency = 'INR'),
        payment_method TEXT NOT NULL CHECK (payment_method IN ('UPI', 'Bank Transfer', 'Other')),
        transaction_reference TEXT NOT NULL,
        payment_date DATE NOT NULL,
        status TEXT NOT NULL DEFAULT 'Awaiting Confirmation'
          CHECK (status IN ('Pending', 'Awaiting Confirmation', 'Completed', 'Disputed')),
        student_confirmed_at TIMESTAMPTZ,
        dispute_reason TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE (owner_id, transaction_reference)
      )
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS payment_status_history (
        id SERIAL PRIMARY KEY,
        payment_id INTEGER NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
        from_status TEXT,
        to_status TEXT NOT NULL,
        changed_by INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
        changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    console.log('✅ Profile categories schema ready.');
  } catch (error) {
    console.error('❌ Could not prepare profile categories schema:', error);
  }

  app.listen(PORT, () => {
    console.log(
      `🚀 ProjeX server running on port ${PORT}`
    );
  });
}

startServer();