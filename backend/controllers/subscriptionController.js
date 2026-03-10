const subscriptionService = require("../services/subscriptionService")

const getPlans = async (req, res) => {

  const plans = await subscriptionService.getPlans(
    req.user.user_id
  )

  res.json(plans)
}

const getPlanById = async (req, res) => {
  try {
    const plan = await subscriptionService.getPlanById(req.params.id)

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" })
    }

    res.json(plan)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const createPlan = async (req, res) => {

  const plan = await subscriptionService.createPlan({
    admin_id: req.user.user_id,
    flat_type: req.body.flat_type,
    monthly_rate: req.body.monthly_rate,
    effective_from: req.body.effective_from
  })

  res.status(201).json(plan)
}

const updatePlan = async (req, res) => {

  const plan = await subscriptionService.updatePlan(
    req.user.user_id,
    req.params.id,
    req.body
  )

  res.json(plan)
}

const deletePlan = async (req, res) => {

  await subscriptionService.deletePlan(
    req.user.user_id,
    req.params.id
  )

  res.json({ message: "Plan deleted" })
}

module.exports = {
  getPlans,
  getPlanById,
  createPlan,
  updatePlan,
  deletePlan
}