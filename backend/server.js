const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// --- AUTH ---
app.post('/auth/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3)', [name, email.toLowerCase(), hashedPassword]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ success: false }); }
});

app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [email]);
    if (result.rows.length > 0) {
      const isMatch = await bcrypt.compare(password, result.rows[0].password);
      if (isMatch) {
        const token = jwt.sign({ user_id: result.rows[0].user_id }, process.env.JWT_SECRET || 'dev_secret');
        return res.json({ success: true, token, user: { email: result.rows[0].email, name: result.rows[0].name } });
      }
    }
    res.status(401).json({ success: false });
  } catch (err) { res.status(500).json({ success: false }); }
});

// --- DASHBOARD DATA ---
app.get('/api/surveys', async (req, res) => {
  try {
    const user = await pool.query('SELECT user_id FROM users WHERE email = $1', [req.query.email]);
    const result = await pool.query('SELECT * FROM surveys WHERE user_id = $1 ORDER BY created_at DESC', [user.rows[0].user_id]);
    res.json({ success: true, surveys: result.rows });
  } catch (err) { res.status(500).json({ success: false }); }
});

app.post('/api/surveys', async (req, res) => {
  const { title, creator_email } = req.body;
  try {
    const user = await pool.query('SELECT user_id FROM users WHERE email = $1', [creator_email]);
    const result = await pool.query('INSERT INTO surveys (user_id, title) VALUES ($1, $2) RETURNING survey_id', [user.rows[0].user_id, title]);
    res.json({ success: true, surveyId: result.rows[0].survey_id });
  } catch (err) { res.status(500).json({ success: false }); }
});

app.post('/api/questions', async (req, res) => {
  const { survey_id, question_text, question_type } = req.body;
  try {
    await pool.query('INSERT INTO questions (survey_id, question_text, question_type) VALUES ($1, $2, $3)', [survey_id, question_text, question_type]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ success: false }); }
});

// --- NEW ANALYTICS ROUTE ---
app.get('/api/surveys/:id/responses', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.response_value, q.question_text, r.submitted_at 
      FROM responses r
      JOIN questions q ON r.question_id = q.question_id
      WHERE r.survey_id = $1
      ORDER BY r.submitted_at DESC`, [req.params.id]);
    res.json({ success: true, responses: result.rows });
  } catch (err) { res.status(500).json({ success: false }); }
});

// --- PUBLIC VIEW ---
app.get('/api/public/surveys/:id', async (req, res) => {
  try {
    const s = await pool.query('SELECT * FROM surveys WHERE survey_id = $1', [req.params.id]);
    const q = await pool.query('SELECT * FROM questions WHERE survey_id = $1', [req.params.id]);
    res.json({ success: true, survey: s.rows[0], questions: q.rows });
  } catch (err) { res.status(500).json({ success: false }); }
});

app.post('/api/public/responses', async (req, res) => {
  const { survey_id, answers } = req.body;
  try {
    for (let a of answers) {
      await pool.query('INSERT INTO responses (survey_id, question_id, response_value) VALUES ($1, $2, $3)', [survey_id, a.question_id, a.val]);
    }
    res.json({ success: true });
  } catch (err) { res.status(500).json({ success: false }); }
});

app.listen(5000, () => console.log("🚀 Server: http://localhost:5000"));
