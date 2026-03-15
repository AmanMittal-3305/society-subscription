const pool = require("../config/db");

// Get all sent notifications (admin view)
const getNotifications = async (adminId) => {
    const result = await pool.query(
        `
    SELECT n.*, u.full_name
    FROM notifications n
    LEFT JOIN users u ON n.recipient_id = u.user_id
    ORDER BY n.sent_at DESC
    LIMIT 50
    `,
        []
    );
    return result.rows;
};

// Send notification to specific recipients or all residents
const sendNotification = async (data, adminId) => {
    const { title, message, send_to_all, recipient_ids } = data;
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        let recipients = [];

        if (send_to_all) {
            const res = await client.query(
                `SELECT user_id FROM users WHERE role = 'RESIDENT'`
            );
            recipients = res.rows.map((r) => r.user_id);
        } else {
            recipients = recipient_ids || [];
        }

        for (const recipientId of recipients) {
            await client.query(
                `INSERT INTO notifications (recipient_id, title, message) VALUES ($1, $2, $3)`,
                [recipientId, title, message]
            );
        }

        await client.query("COMMIT");
        return { success: true, count: recipients.length };
    } catch (err) {
        await client.query("ROLLBACK");
        throw err;
    } finally {
        client.release();
    }
};

module.exports = { getNotifications, sendNotification };
