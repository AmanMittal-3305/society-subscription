const pool = require("../config/db")
const { v4: uuidv4 } = require("uuid")

// Get monthly records
const getMonthlyRecords = async (admin_id, month) => {

  const query = `
  SELECT 
    mr.record_id,
    f.flat_number,
    f.flat_type,
    mr.amount_due,
    s.monthly_rate,
    mr.status

  FROM monthly_records mr

  JOIN flats f 
  ON f.flat_id = mr.flat_id

  JOIN subscription_plans s
  ON s.flat_type = f.flat_type
  AND s.admin_id = f.admin_id

  WHERE f.admin_id = $1
  AND mr.billing_month = $2

  ORDER BY f.flat_number
  `

  const result = await pool.query(query, [admin_id, month])

  return result.rows
}


// const pool = require("../config/db")
// const { v4: uuidv4 } = require("uuid")

const markAsPaid = async (record_id, admin_id) => {

  const client = await pool.connect()

  try {

    await client.query("BEGIN")

    // get monthly record
    const recordRes = await client.query(
      `SELECT * FROM monthly_records WHERE record_id=$1`,
      [record_id]
    )

    if (recordRes.rows.length === 0) {
      throw new Error("Record not found")
    }

    const record = recordRes.rows[0]

    // insert payment
    await client.query(
      `
      INSERT INTO payments
      (
        payment_id,
        record_id,
        amount_paid,
        payment_mode,
        payment_source,
        transaction_id,
        recorded_by
      )
      VALUES
      ($1,$2,$3,$4,$5,$6,$7)
      `,
      [
        uuidv4(),
        record.record_id,
        record.amount_due,
        "CASH",          // must match CHECK constraint
        "OFFLINE",       // must match CHECK constraint
        null,
        admin_id
      ]
    )

    // update monthly record
    await client.query(
      `
      UPDATE monthly_records
      SET status='PAID'
      WHERE record_id=$1
      `,
      [record_id]
    )

    await client.query("COMMIT")

    return true

  } catch (err) {

    await client.query("ROLLBACK")
    console.error(err)
    throw err

  } finally {

    client.release()

  }

}


module.exports = {
    getMonthlyRecords,
    markAsPaid
}