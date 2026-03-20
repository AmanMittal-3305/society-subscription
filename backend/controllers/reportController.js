const pool = require("../config/db");

exports.getMonthlyReport = async (req, res) => {

  const { month } = req.query;

  const formattedMonth = month;

  try {

    // Total collection
    const totalCollection = await pool.query(
      `SELECT COALESCE(SUM(p.amount_paid),0) AS total
       FROM payments p
       JOIN monthly_records m
       ON p.record_id = m.record_id
       WHERE DATE_TRUNC('month', m.billing_month)
       = DATE_TRUNC('month',$1::date)`,
      [formattedMonth]
    );



    // Pending amount
    const pendingAmount = await pool.query(
      `SELECT COALESCE(SUM(mr.amount),0) AS total
       FROM monthly_records mr
       join flats f on mr.flat_id = f.flat_id
       WHERE DATE_TRUNC('month', mr.billing_month)
       = DATE_TRUNC('month',$1::date)
       AND mr.status!='PAID'
       AND f.resident_id IS NOT NULL`,
      [formattedMonth]
    );



    // Paid / pending flats
    const flats = await pool.query(
      `SELECT
       COUNT(*) FILTER (WHERE status='PAID') AS paid,
       COUNT(*) FILTER (WHERE status!='PAID') AS pending
       FROM monthly_records
       WHERE DATE_TRUNC('month', billing_month)
       = DATE_TRUNC('month',$1::date)`,
      [formattedMonth]
    );



    // Payment mode breakdown
    const paymentModes = await pool.query(
      `SELECT payment_mode,
       SUM(amount_paid) AS total
       FROM payments
       WHERE DATE_TRUNC('month', payment_date)
       = DATE_TRUNC('month',$1::date)
       GROUP BY payment_mode`,
      [formattedMonth]
    );



    res.json({

      month,

      total_collection: totalCollection.rows[0].total,

      pending_amount: pendingAmount.rows[0].total,

      paid_flats: flats.rows[0].paid,

      pending_flats: flats.rows[0].pending,

      payment_modes: paymentModes.rows

    });

  } catch (err) {

    console.error("REPORT ERROR:", err);

    res.status(500).json({
      message: "Report generation failed",
      error: err.message
    });

  }

};