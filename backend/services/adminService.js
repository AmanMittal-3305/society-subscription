const pool = require("../config/db")
// const bcrypt = require("bcrypt")

// const register = async ({ email, password, full_name, phone_number }) => {

//   const hashedPassword = await bcrypt.hash(password, 10)

//   const result = await pool.query(
//     `INSERT INTO users (email, password_hash, full_name, phone_number, role)
//      VALUES ($1,$2,$3,$4,'admin')
//      RETURNING user_id, email, full_name, role`,
//     [email, hashedPassword, full_name, phone_number]
//   )

//   return result.rows[0]
// }

// const login = async ({ email, password }) => {

//   const result = await pool.query(
//     `SELECT * FROM users WHERE email=$1 AND role='admin'`,
//     [email]
//   )

//   if (result.rows.length === 0) return null

//   const admin = result.rows[0]

//   const validPassword = await bcrypt.compare(password, admin.password_hash)

//   if (!validPassword) return null

//   return {
//     user_id: admin.user_id,
//     email: admin.email,
//     full_name: admin.full_name,
//     role: admin.role
//   }
// }

// const getDashboardData = async (adminId) => {
//   const totalFlats = await pool.query(
//     `SELECT COUNT(*) FROM flats WHERE admin_id = $1`, [adminId]
//   );

//   const totalResidents = await pool.query(
//     `SELECT COUNT(resident_id) FROM flats WHERE admin_id = $1 AND resident_id IS NOT NULL`, [adminId]
//   );

//   const totalCollected = await pool.query(
//     `SELECT COALESCE(SUM(p.amount_paid),0) as sum
//      FROM payments p
//      JOIN monthly_records mr ON p.record_id = mr.record_id
//      JOIN flats f ON mr.flat_id = f.flat_id
//      WHERE f.admin_id = $1`, [adminId]
//   );

//   const totalPending = await pool.query(
//     `SELECT COALESCE(SUM(mr.amount_due),0) as sum
//      FROM monthly_records mr
//      JOIN flats f ON mr.flat_id = f.flat_id
//      WHERE f.admin_id = $1 AND mr.status = 'PENDING'`, [adminId]
//   );

//   const recentTransactions = await pool.query(
//     `SELECT mr.record_id as id, f.flat_number as flat, mr.amount_due as amount, mr.created_at as date, mr.status
//      FROM monthly_records mr
//      JOIN flats f ON mr.flat_id = f.flat_id
//      WHERE f.admin_id = $1
//      ORDER BY mr.created_at DESC
//      LIMIT 4`, [adminId]
//   );

//   const revenueAnalyticsResult = await pool.query(
//     `SELECT to_char(billing_month, 'Mon') as month, COALESCE(SUM(amount_due),0) as amount
//      FROM monthly_records mr
//      JOIN flats f ON mr.flat_id = f.flat_id
//      WHERE f.admin_id = $1
//      GROUP BY billing_month
//      ORDER BY billing_month DESC
//      LIMIT 6`, [adminId]
//   );

//   const revenueAnalyticsRaw = revenueAnalyticsResult.rows.reverse();
//   const revenueAnalytics = {
//     months: revenueAnalyticsRaw.map(r => r.month),
//     amounts: revenueAnalyticsRaw.map(r => parseFloat(r.amount))
//   };

//   return {
//     total_flats: parseInt(totalFlats.rows[0].count),
//     total_residents: parseInt(totalResidents.rows[0].count),
//     total_collected: parseFloat(totalCollected.rows[0].sum),
//     total_pending: parseFloat(totalPending.rows[0].sum),
//     recent_transactions: recentTransactions.rows,
//     revenue_analytics: revenueAnalytics
//   };
// };

// GET MONTHLY RECORDS
const getMonthlyRecords = async (month) => {

  const query = `
  SELECT
    mr.record_id,
    f.flat_number,
    f.flat_type,
    mr.billing_month,
    mr.amount_due,
    mr.status
  FROM monthly_records mr
  JOIN flats f ON mr.flat_id = f.flat_id
  WHERE mr.billing_month = $1
  ORDER BY f.flat_number
  `;

  const result = await pool.query(query, [month]);

  return result.rows;
};



// GENERATE MONTHLY RECORDS
const generateMonthlyRecords = async (month) => {

  const flats = await pool.query(`
    SELECT flat_id, flat_type
    FROM flats
    WHERE is_active = true
  `);

  const generatedRecords = [];

  for (let flat of flats.rows) {

    const plan = await pool.query(
      `SELECT monthly_rate
       FROM subscription_plans
       WHERE flat_type = $1`,
      [flat.flat_type]
    );

    if (plan.rows.length === 0) continue;

    const amount = plan.rows[0].monthly_rate;

    const existing = await pool.query(
      `SELECT * FROM monthly_records
       WHERE flat_id = $1 AND billing_month = $2`,
      [flat.flat_id, month]
    );

    if (existing.rows.length === 0) {

      const record = await pool.query(
        `INSERT INTO monthly_records
         (flat_id, billing_month, amount_due, status)
         VALUES ($1,$2,$3,'pending')
         RETURNING *`,
        [flat.flat_id, month, amount]
      );

      generatedRecords.push(record.rows[0]);
    }
  }

  return generatedRecords;
};

const generateBills = async (month) => {

  const flats = await pool.query(`
      SELECT flat_id, flat_type
      FROM flats
      WHERE is_active = true
  `);

  const generatedBills = [];

  for (let flat of flats.rows) {

    const plan = await pool.query(
      `SELECT monthly_rate
       FROM subscription_plans
       WHERE flat_type = $1`,
      [flat.flat_type]
    );

    if (plan.rows.length === 0) continue;

    const amount = plan.rows[0].monthly_rate;

    const existing = await pool.query(
      `SELECT record_id
       FROM monthly_records
       WHERE flat_id = $1
       AND billing_month = $2`,
      [flat.flat_id, month]
    );

    if (existing.rows.length > 0) continue;

    const record = await pool.query(
      `INSERT INTO monthly_records
      (flat_id, billing_month, amount_due, status)
      VALUES ($1,$2,$3,'pending')
      RETURNING *`,
      [flat.flat_id, month, amount]
    );

    generatedBills.push(record.rows[0]);
  }

  return generatedBills;
};

const manualPayment = async (data) => {

  const {
    record_id,
    amount_paid,
    payment_mode,
    transaction_id,
    recorded_by
  } = data;

  // insert payment
  const payment = await pool.query(
    `INSERT INTO payments
    (record_id, amount_paid, payment_mode, transaction_id, recorded_by)
    VALUES ($1,$2,$3,$4,$5)
    RETURNING *`,
    [record_id, amount_paid, payment_mode, transaction_id, recorded_by]
  );

  // update monthly record status
  await pool.query(
    `UPDATE monthly_records
     SET status = 'paid'
     WHERE record_id = $1`,
    [record_id]
  );

  return payment.rows[0];
};

module.exports = {
  //   register,
  //   login,
  // getDashboardData,
  getMonthlyRecords,
  generateMonthlyRecords,
  generateBills,
  manualPayment
}