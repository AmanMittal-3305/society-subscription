const pool = require("../config/db")
const { v4: uuidv4 } = require("uuid")

const getAllFlats = async (adminId, page = 1, limit = 10) => {
  const offset = (page - 1) * limit

  const result = await pool.query(
    `
    SELECT
      f.flat_id,
      f.flat_number,
      f.flat_type,
      f.owner_name,
      f.address,
      f.resident_id,
      f.is_active,
      f.is_visible,
      u.full_name AS resident_name
    FROM flats f
    LEFT JOIN users u
      ON f.resident_id = u.user_id
    WHERE f.admin_id = $1
    ORDER BY f.flat_number
    LIMIT $2 OFFSET $3
    `,
    [adminId, limit, offset]
  )

  const countResult = await pool.query(
    `
    SELECT COUNT(*)
    FROM flats
    WHERE admin_id = $1
    `,
    [adminId]
  )

  return {
    flats: result.rows,
    total: parseInt(countResult.rows[0].count),
    totalPages: Math.ceil(countResult.rows[0].count / limit)
  }
} 

// Create a flat + initial monthly record
const createFlat = async ({ flat_number, owner_name, flat_type, address, admin_id }) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1️⃣ Insert the flat
    const flatResult = await client.query(
      `
      INSERT INTO flats (flat_number, owner_name, flat_type, address, admin_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [flat_number, owner_name, flat_type, address, admin_id]
    );

    const flat = flatResult.rows[0];

    // 2️⃣ Get the current subscription rate for this flat_type & admin
    const subResult = await client.query(
  `
  SELECT monthly_rate
  FROM subscription_plans
  WHERE admin_id = $1
    AND flat_type = $2
    AND effective_from <= DATE_TRUNC('month', CURRENT_DATE)
  ORDER BY effective_from DESC
  LIMIT 1
  `,
  [admin_id, flat_type]
)

    const monthlyRate = subResult.rows.length > 0 ? subResult.rows[0].monthly_rate : 0;

    // 3️⃣ Insert initial monthly record for the current month
    await client.query(
      `
      INSERT INTO monthly_records
      (flat_id, billing_month, amount, status)
      VALUES ($1, DATE_TRUNC('month', CURRENT_DATE), $2, 'PENDING')
      `,
      [flat.flat_id, monthlyRate]
    );

    await client.query("COMMIT");

    return flat;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};


const updateFlat = async (id, data) => {

  const {
    flat_number,
    flat_type,
    owner_name,
    address
  } = data

  const result = await pool.query(
  `
  UPDATE flats
  SET
    flat_number=$1,
    flat_type=$2,
    owner_name=$3,
    address=$4
  WHERE flat_id=$5 AND is_active=true
  RETURNING *
  `,
  [flat_number, flat_type, owner_name, address, id]
)

  return result.rows[0]
}

const deleteFlat = async (id) => {
  const result = await pool.query(
    `
    UPDATE flats
    SET is_active = false
    WHERE flat_id = $1
    AND resident_id IS NULL
    RETURNING *
    `,
    [id]
  )

  return result.rows[0]
}

const restoreFlat = async (id) => {
  const result = await pool.query(
    `
    UPDATE flats
    SET is_active = true
    WHERE flat_id = $1
    RETURNING *
    `,
    [id]
  )

  return result.rows[0]
}

const getFlatById = async (id) => {

  const result = await pool.query(
    `
    SELECT
      flat_id,
      flat_number,
      flat_type,
      owner_name,
      address
    FROM flats
    WHERE flat_id=$1
    `,
    [id]
  )

  return result.rows[0]
}

const getAvailableResidents = async()=>{

  const result = await pool.query(
    `
    SELECT u.user_id, u.full_name, u.email
    FROM users u
    LEFT JOIN flats f
      ON u.user_id = f.resident_id
    WHERE u.role='RESIDENT'
      AND f.resident_id IS NULL
    ORDER BY u.full_name
    `
  )

  return result.rows
}
const assignResident = async(flatId,residentId)=>{

  const result = await pool.query(
    `
    UPDATE flats
    SET resident_id=$1
    WHERE flat_id=$2
    RETURNING *
    `,
    [residentId, flatId]
  )

  return result.rows[0]
}

const registerResident = async (flat_id, data) => {

  const {
    full_name,
    email,
    phone_number
  } = data

  const client = await pool.connect()

  try {

    await client.query("BEGIN")

    // check email
    const existing = await client.query(
      `SELECT user_id FROM users WHERE email=$1`,
      [email]
    )

    if (existing.rows.length > 0) {
      throw new Error("Email already registered")
    }

    // insert resident
    const userRes = await client.query(
      `
      INSERT INTO users
      (
        user_id,
        email,
        password_hash,
        full_name,
        phone_number,
        role
      )
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING user_id
      `,
      [
        uuidv4(),
        email,
        "default123",
        full_name,
        phone_number,
        "RESIDENT"
      ]
    )

    const resident_id = userRes.rows[0].user_id

    // assign flat
    // await client.query(
    //   `
    //   UPDATE flats
    //   SET resident_id=$1
    //   WHERE flat_id=$2
    //   `,
    //   [resident_id, flat_id]
    // )

    await client.query("COMMIT")

    return {
      message: "Resident registered and assigned"
    }

  } catch (err) {

    await client.query("ROLLBACK")
    throw err

  } finally {

    client.release()

  }

}

module.exports = {
  getAllFlats,
  createFlat,
  updateFlat,
  deleteFlat,
  getFlatById,
  getAvailableResidents,
  assignResident,
  registerResident,
  restoreFlat
}