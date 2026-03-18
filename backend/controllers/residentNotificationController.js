const pool = require("../config/db");

const saveFCMToken = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { token } = req.body;

    await pool.query(
      `
      UPDATE users
      SET fcm_token = $1
      WHERE user_id = $2
      `,
      [token, userId]
    );

    res.json({
      success: true,
      message: "Token saved"
    });

  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false
    });
  }
};

const getNotifications = async (req, res) => {
  try {
    const residentId = req.user.user_id;

    const result = await pool.query(
      `
      SELECT *
      FROM notifications
      WHERE recipient_id = $1
      ORDER BY sent_at DESC
      `,
      [residentId]
    );

    res.json(result.rows);

  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false
    });
  }
};

module.exports = {
  saveFCMToken,
  getNotifications
};