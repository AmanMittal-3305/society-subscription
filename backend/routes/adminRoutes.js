const express = require("express")
const router = express.Router()

const adminController = require("../controllers/adminController")
const flatController = require("../controllers/flatController")
const subscriptionController = require('../controllers/subscriptionController')
const { getProfile } = require("../controllers/adminProfileContoller");
const authMiddleware = require("../middleware/authMiddleWare");
const monthlyRecordController = require('../controllers/monthlyRecordController')
const paymentController = require("../controllers/paymentController")
const reportController = require("../controllers/reportController")
const {dashboard} =  require("../controllers/dashboardController")

// router.post("/register", adminController.register)
// router.post("/login", adminController.login)


// router.get("/monthly-records", adminController.getMonthlyRecords);
// router.post("/monthly-records/generate", adminController.generateMonthlyRecords);

router.post("/generate-bills", adminController.generateBills);
router.post("/payment/manual", adminController.manualPayment);

router.get("/flats", authMiddleware, flatController.getFlats)
router.post("/flats", authMiddleware, flatController.createFlat)
router.get("/flats/available-residents", flatController.getAvailableResidents)
router.put("/flats/:id/assign-resident", flatController.assignResident)
router.get("/flats/:id", authMiddleware, flatController.getFlatById)
router.post("/flats/:id/register-resident", authMiddleware, flatController.registerResident)
router.put("/flats/:id", authMiddleware, flatController.updateFlat)
router.delete("/flats/:id", authMiddleware, flatController.deleteFlat)

router.get("/subscriptions", authMiddleware, subscriptionController.getPlans)

router.get("/subscriptions/:id", authMiddleware, subscriptionController.getPlanById)

router.post("/subscriptions", authMiddleware, subscriptionController.createPlan)

router.put("/subscriptions/:id", authMiddleware, subscriptionController.updatePlan)

router.delete("/subscriptions/:id", authMiddleware, subscriptionController.deletePlan)


router.get("/monthly-records", authMiddleware, monthlyRecordController.getRecords)

router.put(
  "/monthly-records/:record_id/mark-paid",
  authMiddleware,
  monthlyRecordController.markPaid
)

router.get(
  "/payment-entry",
  authMiddleware,
  paymentController.getPaymentEntry
)

router.post(
  "/payment-entry",
  authMiddleware,
  paymentController.createPaymentEntry
)

router.get("/reports/monthly", authMiddleware, reportController.getMonthlyReport)


router.get("/dashboard", authMiddleware, dashboard)



router.get("/profile", authMiddleware, getProfile);

module.exports = router