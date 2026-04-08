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

// DATABASE INITIALIZATION & DEBUGGING
const initDb = async () => {
  try {
    // 1. Force create the users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL
      );
    `);

    // 2. DEBUG: Log exactly where we are connected
    const dbInfo = await pool.query("SELECT current_database(), current_user;");
    const tableCheck = await pool.query("SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public';");
    
    console.log("-----------------------------------------");
    console.log(`📡 DB NAME: ${dbInfo.rows[0].current_database}`);
    console.log(`👤 DB USER: ${dbInfo.rows[0].current_user}`);
    console.log(`📂 TABLES: ${tableCheck.rows.map(r => r.tablename).join(", ")}`);
    console.log("-----------------------------------------");
  } catch (err) {
    console.error("❌ DATABASE CONNECTION ERROR:", err.message);
  }
};
initDb();

// SIGNUP ROUTE
app.post('/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING email',
      [name, email.toLowerCase(), hashedPassword]
    );
    const token = jwt.sign({ email: result.rows[0].email }, process.env.JWT_SECRET);
    res.json({ token, user: { email: result.rows[0].email } });
  } catch (err) {
    console.error("Signup Error:", err.message);
    res.status(500).json({ error: "Email already exists or server error" });
  }
});

// LOGIN ROUTE
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [email]);

    if (result.rows.length > 0) {
      const isMatch = await bcrypt.compare(password, result.rows[0].password);
      if (isMatch) {
        const token = jwt.sign({ email: result.rows[0].email }, process.env.JWT_SECRET);
        return res.json({ token, user: { email: result.rows[0].email } });
      }
    }
    res.status(401).json({ error: "Invalid email or password" });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server active on port ${PORT}`));
