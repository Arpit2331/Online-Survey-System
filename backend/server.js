const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// AUTO-DB INITIALIZATION
const initDb = async () => {
  try {
    await pool.query(`
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
    `);
    console.log("✅ Database tables verified");
  } catch (err) {
    console.error("❌ DB Init Error:", err.message);
  }
};
initDb();

// SIGNUP ROUTE
app.post('/auth/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING email',
      [name, email.toLowerCase(), hashedPassword]
    );
    const token = jwt.sign({ email: result.rows[0].email }, process.env.JWT_SECRET);
    res.json({ success: true, token, user: { email: result.rows[0].email } });
  } catch (err) {
    res.status(500).json({ success: false, error: "Email already registered" });
  }
});

// LOGIN ROUTE
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [email]);
    if (result.rows.length > 0) {
      const isMatch = await bcrypt.compare(password, result.rows[0].password);
      if (isMatch) {
        const token = jwt.sign({ email: result.rows[0].email }, process.env.JWT_SECRET);
        return res.json({ success: true, token, user: { email: result.rows[0].email } });
      }
    }
    res.status(401).json({ success: false, error: "Invalid email or password" });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// SURVEY ROUTE
app.post('/api/surveys', async (req, res) => {
  const { title, description, creator_email } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO surveys (title, description, creator_email) VALUES ($1, $2, $3) RETURNING id',
      [title, description, creator_email]
    );
    res.json({ success: true, surveyId: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
