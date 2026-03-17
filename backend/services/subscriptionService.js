const pool = require("../config/db")

// GET ALL PLANS
const getPlans = async (admin_id) => {

  const result = await pool.query(
    `SELECT *
     FROM subscription_plans
     WHERE admin_id = $1
     ORDER BY flat_type`,
    [admin_id]
  )

  return result.rows
}

// GET SINGLE PLAN
const getPlanById = async (admin_id, plan_id) => {

  const result = await pool.query(
    `SELECT *
     FROM subscription_plans
     WHERE plan_id = $1
     AND admin_id = $2`,
    [plan_id, admin_id]
  )

  return result.rows[0]
}

// CREATE PLAN
const createPlan = async ({
  admin_id,
  flat_type,
  monthly_rate,
  effective_from
}) => {

  const result = await pool.query(
    `INSERT INTO subscription_plans
     (admin_id, flat_type, monthly_rate, effective_from)
     VALUES ($1,$2,$3,$4)
     RETURNING *`,
    [
      admin_id,
      flat_type,
      monthly_rate,
      effective_from || new Date()
    ]
  )

  return result.rows[0]
}

// UPDATE PLAN
const updatePlan = async (
  admin_id,
  plan_id,
  { monthly_rate }
) => {

  const today = new Date()

  const nextMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
  )

  const result = await pool.query(
    `
    UPDATE subscription_plans
    SET monthly_rate = $1,
        effective_from = $2,
        updated_at = CURRENT_TIMESTAMP
    WHERE plan_id = $3
      AND admin_id = $4
    RETURNING *
    `,
    [
      monthly_rate,
      nextMonth,
      plan_id,
      admin_id
    ]
  )

  return result.rows[0]
}

// DELETE PLAN
const deletePlan = async (admin_id, plan_id) => {

  await pool.query(
    `DELETE FROM subscription_plans
     WHERE plan_id=$1
     AND admin_id=$2`,
    [plan_id, admin_id]
  )
}

module.exports = {
  getPlans,
  getPlanById,
  createPlan,
  updatePlan,
  deletePlan
}