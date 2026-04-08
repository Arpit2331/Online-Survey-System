const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// 1. Database Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// 2. AUTO-BUILD DATABASE TABLES
// This runs every time the server starts, bypassing the Neon UI glitches.
const initDb = async () => {
  const queryText = `
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL
    );
    CREATE TABLE IF NOT EXISTS surveys (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        creator_email VARCHAR(100)
    );
    CREATE TABLE IF NOT EXISTS questions (
        id SERIAL PRIMARY KEY,
        survey_id INTEGER REFERENCES surveys(id) ON DELETE CASCADE,
        question_text TEXT NOT NULL,
        question_type VARCHAR(50) NOT NULL,
        options JSONB
    );
    CREATE TABLE IF NOT EXISTS responses (
        id SERIAL PRIMARY KEY,
        survey_id INTEGER REFERENCES surveys(id) ON DELETE CASCADE,
        responder_email VARCHAR(100),
        answers JSONB,
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    await pool.query(queryText);
    console.log("✅ Database structure verified (Tables are ready)");
  } catch (err) {
    console.error("❌ Database initialization error:", err);
  }
};
initDb();

// 3. AUTH ROUTES
app.post('/auth/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, email',
      [name, email, hashedPassword]
    );
    const token = jwt.sign({ email: result.rows[0].email }, process.env.JWT_SECRET);
    res.json({ token, user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: "Registration failed. Email might already exist." });
  }
});

app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length > 0) {
      const validPass = await bcrypt.compare(password, result.rows[0].password);
      if (validPass) {
        const token = jwt.sign({ email: result.rows[0].email }, process.env.JWT_SECRET);
        return res.json({ token, user: { name: result.rows[0].name, email: result.rows[0].email } });
      }
    }
    res.status(401).json({ error: "Invalid credentials" });
  } catch (err) {
    res.status(500).json({ error: "Login error" });
  }
});

// 4. SURVEY ROUTES
app.post('/api/surveys', async (req, res) => {
  const { title, description, creator_email, questions } = req.body;
  try {
    const surveyRes = await pool.query(
      'INSERT INTO surveys (title, description, creator_email) VALUES ($1, $2, $3) RETURNING id',
      [title, description, creator_email]
    );
    const surveyId = surveyRes.rows[0].id;

    for (let q of questions) {
      await pool.query(
        'INSERT INTO questions (survey_id, question_text, question_type, options) VALUES ($1, $2, $3, $4)',
        [surveyId, q.question_text, q.question_type, JSON.stringify(q.options)]
      );
    }
    res.json({ success: true, surveyId });
  } catch (err) {
    res.status(500).json({ error: "Failed to create survey" });
  }
});

app.get('/api/surveys', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM surveys');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch surveys" });
  }
});

app.get('/api/surveys/:id', async (req, res) => {
  try {
    const survey = await pool.query('SELECT * FROM surveys WHERE id = $1', [req.params.id]);
    const questions = await pool.query('SELECT * FROM questions WHERE survey_id = $1', [req.params.id]);
    res.json({ ...survey.rows[0], questions: questions.rows });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch survey details" });
  }
});

app.post('/api/responses', async (req, res) => {
  const { survey_id, responder_email, answers } = req.body;
  try {
    await pool.query(
      'INSERT INTO responses (survey_id, responder_email, answers) VALUES ($1, $2, $3)',
      [survey_id, responder_email, JSON.stringify(answers)]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to save response" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
