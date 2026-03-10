const pool = require("../config/db");

const getProfile = async (req, res) => {
  try {

    const result = await pool.query(
      `SELECT user_id, email, full_name, phone_number, role
       FROM users
       WHERE user_id=$1`,
      [req.user.user_id]
    );

    res.json({
      success: true,
      user: result.rows[0]
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

module.exports = { getProfile };