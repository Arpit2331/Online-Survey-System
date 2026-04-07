const router = require('express').Router();
const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registration Route
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check if user exists
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (user.rows.length !== 0) {
      return res.status(401).send("User already exists");
    }

    // 2. Hash the password (Requirement SEC-03)
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const bcryptPassword = await bcrypt.hash(password, salt);

    // 3. Insert user into database
    const newUser = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, bcryptPassword]
    );

    // 4. Generate JWT (Requirement SEC-01)
    const token = jwt.sign({ id: newUser.rows[0].user_id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
