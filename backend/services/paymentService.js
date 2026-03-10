const pool = require("../config/db")
const { v4: uuidv4 } = require("uuid")

// GET unpaid / partial flats for a month
const getPaymentEntry = async (admin_id, month) => {

  const query = `
  SELECT
    mr.record_id,
    f.flat_id,
    f.flat_number,
    f.flat_type,
    mr.amount_due,
    mr.status
  FROM monthly_records mr
  JOIN flats f ON f.flat_id = mr.flat_id
  WHERE f.admin_id = $1
  AND mr.billing_month = $2
  AND mr.status != 'PAID'
  ORDER BY f.flat_number
  `

  const result = await pool.query(query, [admin_id, month])

  return result.rows
}


// POST manual payment
const createPaymentEntry = async (data, admin_id) => {

  const {
    record_id,
    amount_paid,
    payment_mode,
    payment_source,
    transaction_id
  } = data

  const client = await pool.connect()

  try {

    await client.query("BEGIN")

    const recordRes = await client.query(
      `SELECT amount_due FROM monthly_records WHERE record_id=$1`,
      [record_id]
    )

    if(recordRes.rows.length === 0){
      throw new Error("Monthly record not found")
    }

    const amount_due = recordRes.rows[0].amount_due

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
        record_id,
        amount_paid,
        payment_mode,
        payment_source,
        transaction_id || null,
        admin_id
      ]
    )

    const status = amount_paid >= amount_due ? "PAID" : "PARTIAL"

    await client.query(
      `
      UPDATE monthly_records
      SET status=$1
      WHERE record_id=$2
      `,
      [status, record_id]
    )

    await client.query("COMMIT")

    return { message: "Payment recorded" }

  } catch(err){

    await client.query("ROLLBACK")
    throw err

  } finally {

    client.release()

  }

}

module.exports = {
  getPaymentEntry,
  createPaymentEntry
}