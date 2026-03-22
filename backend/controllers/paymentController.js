const service = require("../services/paymentService")
const pool = require("../config/db");
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// GET unpaid flats
const getPaymentEntry = async (req, res) => {

  try {

    const admin_id = req.user.user_id
    const { month } = req.query

    const data = await service.getPaymentEntry(admin_id, month)

    res.json(data)

  } catch (err) {

    console.error(err)

    res.status(500).json({
      message: "Failed to load payment entries"
    })

  }

}


// CREATE payment
const createPaymentEntry = async (req, res) => {

  try {

    const admin_id = req.user.user_id

    const result = await service.createPaymentEntry(req.body, admin_id)

    res.json(result)

  } catch (err) {

    console.error(err)

    res.status(500).json({
      message: "Payment entry failed"
    })

  }

}



const payNow = async (data, resident_id) => {
  const { record_id, payment_mode, transaction_id } = data;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const recordRes = await client.query(
      `
      SELECT 
        mr.record_id,
        mr.amount,
        mr.status,
        f.flat_id,
        f.resident_id
      FROM monthly_records mr
      JOIN flats f ON mr.flat_id = f.flat_id
      WHERE mr.record_id = $1
      AND f.resident_id = $2
      `,
      [record_id, resident_id]
    );

    if (recordRes.rows.length === 0) {
      throw new Error("This payment record does not belong to your flat");
    }

    if (recordRes.rows[0].status === "PAID") {
      throw new Error("Already paid");
    }

    const amount = recordRes.rows[0].amount;

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
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      `,
      [
        uuidv4(),
        record_id,
        amount,
        payment_mode,
        "ONLINE",
        transaction_id,
        resident_id
      ]
    );

    await client.query(
      `
      UPDATE monthly_records
      SET status = 'PAID'
      WHERE record_id = $1
      `,
      [record_id]
    );

    await client.query("COMMIT");

    return {
      success: true,
      message: "Payment successful"
    };

  } catch (e) {
    await client.query("ROLLBACK");
    throw e;

  } finally {
    client.release();
  }
};


const getPendingPayments = async (req, res) => {
  try {
    const residentId = req.user.user_id; // from authMiddleware

    const result = await pool.query(
      `
      SELECT 
        mr.record_id, 
        mr.billing_month, 
        mr.amount, 
        mr.status, 
        f.flat_number,
        f.created_at
      FROM monthly_records mr
      JOIN flats f ON mr.flat_id = f.flat_id
      WHERE f.resident_id = $1
        AND mr.status != 'PAID'
      ORDER BY mr.billing_month DESC
      `,
      [residentId]
    );

    const pendingPayments = result.rows.map(r => ({
      ...r,
      month: new Date(r.billing_month).toLocaleString("en-IN", { month: "long" }),
      year: new Date(r.billing_month).getFullYear()
    }));

    res.json(pendingPayments); // Returns an array of pending records

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch pending payments" });
  }
};



const createCheckoutSession = async (req, res) => {
  try {
    const { record_id } = req.body;

    const result = await pool.query(
      `
      SELECT mr.amount
      FROM monthly_records mr
      JOIN flats f ON mr.flat_id = f.flat_id
      WHERE mr.record_id = $1
      AND f.resident_id = $2
      `,
      [record_id, req.user.user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Record not found"
      });
    }

    const amount = result.rows[0].amount;

    const session = await stripe.checkout.sessions.create({
  payment_method_types: ["card"],
  line_items: [
    {
      price_data: {
        currency: "inr",
        product_data: {
          name: "Maintenance Payment",
        },
        unit_amount: amount * 100,
      },
      quantity: 1,
    },
  ],
  mode: "payment",
  success_url: "http://localhost:3000/resident/payment-success",
  cancel_url: "http://localhost:3000/resident/payment-cancel",
});

res.json({
  url: session.url,
});

    res.json({
      id: session.id,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  getPaymentEntry,
  payNow, createCheckoutSession,
  createPaymentEntry,getPendingPayments
}