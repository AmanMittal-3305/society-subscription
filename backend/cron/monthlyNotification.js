const cron = require("node-cron");
const pool = require("../config/db");
const NotificationService = require("../services/notificationService");

cron.schedule("0 9 1 * *", async () => {
  try {
    const users = await pool.query(`
      SELECT u.user_id, u.fcm_token, f.flat_number, sp.monthly_rate
      FROM users u
      JOIN flats f ON u.user_id = f.resident_id
      JOIN subscription_plans sp ON f.flat_type = sp.flat_type
      WHERE u.role = 'RESIDENT'
    `);

    for (const user of users.rows) {
      const title = "Monthly Maintenance Due";
      const message = `Flat ${user.flat_number}: ₹${user.monthly_rate} due`;

      await pool.query(
        `
        INSERT INTO notifications (recipient_id, title, message)
        VALUES ($1, $2, $3)
        `,
        [user.user_id, title, message]
      );

      if (user.fcm_token) {
        await NotificationService.sendSingleNotification(
          user.fcm_token,
          title,
          message
        );
      }
    }

    console.log("Monthly notifications sent");

  } catch (e) {
    console.error(e);
  }
});