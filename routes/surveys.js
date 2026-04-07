const router = require('express').Router();
const pool = require('../db');

// REQ-123 & REQ-126: Create a New Survey
router.post('/create', async (req, res) => {
  try {
    const { user_id, title, description } = req.body;

    // Insert into the 'surveys' table you saw in pgAdmin
    const newSurvey = await pool.query(
      "INSERT INTO surveys (user_id, title, description) VALUES ($1, $2, $3) RETURNING *",
      [user_id, title, description]
    );

    res.json(newSurvey.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// REQ-1: Add a Question to a Survey
router.post('/add-question', async (req, res) => {
  try {
    const { survey_id, question_text, question_type, sort_order } = req.body;

    const newQuestion = await pool.query(
      "INSERT INTO questions (survey_id, question_text, question_type, sort_order) VALUES ($1, $2, $3, $4) RETURNING *",
      [survey_id, question_text, question_type, sort_order]
    );

    res.json(newQuestion.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
