const service = require("../services/monthlyRecordService");

// GET /api/admin/monthly-records?month=YYYY-MM-01
exports.getRecords = async (req, res) => {
  try {
    const admin_id = req.user.user_id;
    const month = req.query.month;

    if (!month) return res.status(400).json({ error: "month is required" });

    const records = await service.getMonthlyRecords(admin_id, month);
    res.json(records);
  } catch (err) {
    console.error("Monthly Records Error:", err.message);
    res.status(500).json({ message: "Failed to fetch records" });
  }
};

// PUT /api/admin/monthly-records/:record_id/mark-paid
exports.markPaid = async (req, res) => {
  try {
    const admin_id = req.user.user_id;
    const { record_id } = req.params;

    const result = await service.markAsPaid(record_id, admin_id);
    res.json(result);
  } catch (err) {
    console.error("Mark Paid Error:", err.message);
    res.status(500).json({ message: err.message });
  }
};