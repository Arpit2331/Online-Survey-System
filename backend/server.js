const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config(); // Load variables from a .env file locally

const app = express();
app.use(cors());
app.use(express.json());

// DATABASE CONNECTION
// When deployed, process.env.DATABASE_URL will be provided by your cloud host (Neon/Render)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for most cloud PostgreSQL providers
  },
});

// --- AUTHENTICATION ---
app.post('/auth/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING name, email',
      [name, email, password]
    );
    res.json({ user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    if (user && user.password === password) {
      res.json({ user: { name: user.name, email: user.email } });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- SURVEY MANAGEMENT ---
app.get('/api/surveys/:email', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT s.*, 
      (SELECT COUNT(DISTINCT r.submitted_at) FROM responses r WHERE r.survey_id = s.id) as response_count
      FROM surveys s 
      WHERE s.creator_email = $1 
      ORDER BY s.created_at DESC`, 
      [req.params.email]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/surveys', async (req, res) => {
  const { title, description, creator_email } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO surveys (title, description, creator_email) VALUES ($1, $2, $3) RETURNING id',
      [title, description, creator_email]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete('/api/surveys/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM surveys WHERE id = $1', [req.params.id]);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- QUESTIONS ---
app.post('/api/questions', async (req, res) => {
  const { survey_id, question_text, question_type, options } = req.body;
  try {
    await pool.query(
      'INSERT INTO questions (survey_id, question_text, question_type, options) VALUES ($1, $2, $3, $4)',
      [survey_id, question_text, question_type, options || []]
    );
    res.json({ message: "Question added" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/surveys/:id/questions', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM questions WHERE survey_id = $1 ORDER BY id ASC', [req.params.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Questions not found" });
  }
});

// --- RESPONSES ---
app.post('/api/responses', async (req, res) => {
  const { survey_id, answers } = req.body;
  try {
    const timestamp = new Date();
    for (let ans of answers) {
      await pool.query(
        'INSERT INTO responses (survey_id, question_id, answer_text, submitted_at) VALUES ($1, $2, $3, $4)', 
        [survey_id, ans.question_id, ans.answer_text, timestamp]
      );
    }
    res.json({ message: "Responses saved" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/surveys/public/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM surveys WHERE id = $1', [req.params.id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Survey not found" });
  }
});

app.get('/api/surveys/:id/responses', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT q.question_text, r.answer_text, r.submitted_at 
      FROM questions q 
      JOIN responses r ON q.id = r.question_id
      WHERE q.survey_id = $1 
      ORDER BY r.submitted_at DESC`, 
      [req.params.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PORT CONFIGURATION
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
