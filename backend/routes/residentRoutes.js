
const express = require("express")
const router = express.Router()

const dashboardController = require("../controllers/residentDashboardController");
const authMiddleware = require("../middleware/authMiddleWare");
const paymentController = require("../controllers/paymentController")
const adminController = require("../controllers/adminProfileContoller")
const residentOnly = require("../middleware/residentMiddleware")
const residentSubscriptionController = require("../controllers/residentSubscriptionController")
const notificationController = require("../controllers/residentNotificationController")

router.use(authMiddleware)
router.use(residentOnly)

router.get("/dashboard", dashboardController.getDashboard)
router.get("/profile", adminController.getProfile)
router.put("/profile", adminController.updateProfile)

router.get("/subscriptions", residentSubscriptionController.getSubscriptions)
router.get("/subscriptions/:id", residentSubscriptionController.getSubscriptionDetails)

router.post("/pay-now", paymentController.payNow)
router.get("/pending-payments", paymentController.getPendingPayments)

router.get("/notifications", notificationController.getNotifications);
router.put("/save-token", notificationController.saveFCMToken);

module.exports = router;