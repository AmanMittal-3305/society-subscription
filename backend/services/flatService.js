const pool = require("../config/db")

const getAllFlats = async (adminId) => {

  const result = await pool.query(
    `SELECT flat_id, flat_number, flat_type
     FROM flats
     WHERE admin_id = $1
     ORDER BY flat_number`,
    [adminId]
  )

  return result.rows
}

const createFlat = async (data) => {

  const { admin_id, flat_number, flat_type } = data

  const result = await pool.query(
    `INSERT INTO flats (admin_id, flat_number, flat_type)
     VALUES ($1,$2,$3)
     RETURNING *`,
    [admin_id, flat_number, flat_type]
  )

  return result.rows[0]
}

const updateFlat = async (id, data) => {

  const { flat_number, flat_type } = data

  const result = await pool.query(
    `UPDATE flats
     SET flat_number=$1, flat_type=$2
     WHERE flat_id=$3
     RETURNING *`,
    [flat_number, flat_type, id]
  )

  return result.rows[0]
}

const deleteFlat = async (id) => {

  await pool.query(
    `DELETE FROM flats WHERE flat_id=$1`,
    [id]
  )

}

const getFlatById = async (id) => {

  const result = await pool.query(
    `SELECT * FROM flats WHERE flat_id=$1`,
    [id]
  )

  return result.rows[0]
}

module.exports = {
  getAllFlats,
  createFlat,
  updateFlat,
  deleteFlat,
  getFlatById
}