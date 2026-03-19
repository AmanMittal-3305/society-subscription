const pool = require("../config/db");
const { sendPushNotification } = require("../services/notificationService");

const sendNotification = async (req, res) => {
  try {
    const { title, message, recipient_ids, send_to_all } = req.body;
    const adminId = req.user.user_id;

    const batchResult = await pool.query(`SELECT gen_random_uuid() AS id`);
    const batchId = batchResult.rows[0].id;

    if (send_to_all) {
      const residents = await pool.query(`
        SELECT user_id, full_name, fcm_token
        FROM users
        WHERE role = 'RESIDENT'
      `);

      for (const resident of residents.rows) {
        await pool.query(
          `
          INSERT INTO notifications
          (title, message, recipient_id, sender_id, batch_id)
          VALUES ($1, $2, $3, $4, $5)
          `,
          [title, message, resident.user_id, adminId, batchId]
        );

        if (resident.fcm_token) {
          await sendPushNotification(
            resident.fcm_token,
            title,
            message
          );
        }
      }

    } else {
      for (const residentId of recipient_ids) {
        await pool.query(
          `
          INSERT INTO notifications
          (title, message, recipient_id, sender_id, batch_id)
          VALUES ($1, $2, $3, $4, $5)
          `,
          [title, message, residentId, adminId, batchId]
        );

        const user = await pool.query(
          `
          SELECT fcm_token
          FROM users
          WHERE user_id = $1
          `,
          [residentId]
        );

        if (user.rows[0]?.fcm_token) {
          await sendPushNotification(
            user.rows[0].fcm_token,
            title,
            message
          );
        }
      }
    }

    res.json({
      success: true
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
    const result = await pool.query(`
      SELECT
        n.batch_id,
        n.title,
        n.message,
        MAX(n.sent_at) AS sent_at,
        STRING_AGG(u.full_name, ', ') AS recipients
      FROM notifications n
      LEFT JOIN users u ON n.recipient_id = u.user_id
      GROUP BY n.batch_id, n.title, n.message
      ORDER BY MAX(n.sent_at) DESC
    `);

    const formatted = result.rows.map((row) => {
      const names = row.recipients.split(",").map(name => name.trim())

      let shortRecipients = ""

      if (names.length <= 2) {
        shortRecipients = names.join(", ")
      } else {
        shortRecipients = `${names[0]}, ${names[1]} + ${names.length - 2} others`
      }

      return {
        ...row,
        recipients: shortRecipients
      }
    })

    res.json(formatted)

  } catch (e) {
    console.error(e)
    res.status(500).json({
      success: false
    })
  }
}

const getAllResidents = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT user_id, full_name
      FROM users
      WHERE role = 'RESIDENT'
      ORDER BY full_name
    `)

    res.json(result.rows)

  } catch (e) {
    console.error(e)
    res.status(500).json({
      success: false
    })
  }
}

module.exports = {
  sendNotification,
  getNotifications,
  getAllResidents
};