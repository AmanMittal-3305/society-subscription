const pool = require("../config/db")

// GET ALL PLANS (latest visible plan per flat type)
const getPlans = async (admin_id) => {

  const result = await pool.query(
    `
    SELECT DISTINCT ON (flat_type) *
    FROM subscription_plans
    WHERE admin_id = $1
    ORDER BY flat_type, effective_from DESC
    `,
    [admin_id]
  )

  return result.rows
}

// GET SINGLE PLAN
const getPlanById = async (admin_id, plan_id) => {

  const result = await pool.query(
    `
    SELECT *
    FROM subscription_plans
    WHERE plan_id = $1
      AND admin_id = $2
    `,
    [plan_id, admin_id]
  )

  return result.rows[0]
}

// CREATE PLAN
const createPlan = async ({
  admin_id,
  flat_type,
  monthly_rate
}) => {

  const today = new Date()

  const monthStartDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    1
  )

  const result = await pool.query(
    `
    INSERT INTO subscription_plans
    (admin_id, flat_type, monthly_rate, effective_from)
    VALUES ($1,$2,$3,$4)
    RETURNING *
    `,
    [
      admin_id,
      flat_type,
      monthly_rate,
      monthStartDate
    ]
  )

  return result.rows[0]
}

// UPDATE PLAN (create future plan for next month)
const updatePlan = async (admin_id, plan_id, { monthly_rate }) => {

  const today = new Date()

  const nextMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    1
  )

  const oldPlan = await pool.query(
    `
    SELECT flat_type
    FROM subscription_plans
    WHERE plan_id = $1
      AND admin_id = $2
    `,
    [plan_id, admin_id]
  )

  if (!oldPlan.rows.length) return null

  const flat_type = oldPlan.rows[0].flat_type

  const result = await pool.query(
    `
    INSERT INTO subscription_plans
    (admin_id, flat_type, monthly_rate, effective_from)
    VALUES ($1,$2,$3,$4)
    RETURNING *
    `,
    [
      admin_id,
      flat_type,
      monthly_rate,
      nextMonth
    ]
  )

  return result.rows[0]
}

// DELETE PLAN
const deletePlan = async (admin_id, plan_id) => {

  await pool.query(
    `
    DELETE FROM subscription_plans
    WHERE plan_id = $1
      AND admin_id = $2
    `,
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