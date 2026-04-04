const express = require('express');
const cors = require('cors');
const pool = require('./db'); // Import the DB connection we just made
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parses incoming JSON requests (REQ-158)

// Test Route
app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ message: 'Database Connected!', time: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Database connection error');
  }
});

app.use('/auth', require('./routes/auth'));
// Survey Routes (System Feature 3.1)
app.use('/surveys', require('./routes/surveys'));
app.use('/responses', require('./routes/responses'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
