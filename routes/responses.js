const router = require('express').Router();
const pool = require('../db');

// REQ-82: Submit a Response
router.post('/submit', async (req, res) => {
  try {
    const { survey_id, question_id, response_value } = req.body;

    const newResponse = await pool.query(
      "INSERT INTO responses (survey_id, question_id, response_value) VALUES ($1, $2, $3) RETURNING *",
      [survey_id, question_id, response_value]
    );

    res.json({ message: "Response recorded!", data: newResponse.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error during submission");
  }
});

module.exports = router;
