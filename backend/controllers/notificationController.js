const pool = require("../config/db");
const axios = require("axios");

// Admin sends notification
const sendNotification = async (req, res) => {
  const { title, message, recipientIds } = req.body; // array of UUIDs or ["ALL"]

  try {
    let targetIds = recipientIds;

    // If sending to all residents
    if (recipientIds.length === 1 && recipientIds[0] === "ALL") {
      const all = await pool.query(
        "SELECT user_id, external_user_id FROM users WHERE role = 'resident'"
      );
      targetIds = all.rows.map(r => r.user_id);
    }

    // Fetch external_user_ids (OneSignal Player IDs) for push
    const { rows: residents } = await pool.query(
      "SELECT user_id, external_user_id FROM users WHERE user_id = ANY($1::uuid[])",
      [targetIds]
    );

    const oneSignalIds = residents
      .map(r => r.external_user_id)
      .filter(id => id);

    // Send push notification via OneSignal
    if (oneSignalIds.length > 0) {
      await axios.post(
        "https://onesignal.com/api/v1/notifications",
        {
          app_id: process.env.ONESIGNAL_APP_ID,
          headings: { en: title },
          contents: { en: message },
          include_player_ids: oneSignalIds,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${process.env.ONESIGNAL_REST_KEY}`,
          },
        }
      );
    }

    // Store notifications in DB
    for (let id of targetIds) {
      await pool.query(
        "INSERT INTO notifications (recipient_id, title, message) VALUES ($1, $2, $3)",
        [id, title, message]
      );
    }

    res.json({ success: true, message: "Notification sent successfully" });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ success: false, message: "Failed to send notification" });
  }
};


// Get notifications for resident
const getNotifications = async (req, res) => {
  try {
    const residentId = req.user.user_id;
    const { rows } = await pool.query(
      "SELECT * FROM notifications WHERE recipient_id = $1 ORDER BY sent_at DESC",
      [residentId]
    );
    res.json({ success: true, notifications: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

// Mark notification as read
const markAsRead = async (req, res) => {
  try {
    const residentId = req.user.user_id;
    const notificationId = req.params.id;

    await pool.query(
      "UPDATE notifications SET is_read = TRUE WHERE notification_id = $1 AND recipient_id = $2",
      [notificationId, residentId]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

module.exports = {
    sendNotification,
    getNotifications,
    markAsRead
}