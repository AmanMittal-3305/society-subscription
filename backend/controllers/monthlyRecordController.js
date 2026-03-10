const service = require("../services/monthlyRecordService")

// Get records
exports.getRecords = async (req, res) => {

  try {

    const admin_id = req.user.user_id
    const { month } = req.query

    const records = await service.getMonthlyRecords(admin_id, month)

    res.json(records)

  } catch (error) {

    console.error(error)

    res.status(500).json({
      message: "Failed to fetch records"
    })
  }
}



// Mark as paid
exports.markPaid = async (req, res) => {

  try {

    const admin_id = req.user.user_id
    const { record_id } = req.params

    const result = await service.markAsPaid(record_id, admin_id)

    res.json(result)

  } catch (error) {

    console.error(error)

    res.status(500).json({
      message: "Failed to update payment"
    })
  }
}