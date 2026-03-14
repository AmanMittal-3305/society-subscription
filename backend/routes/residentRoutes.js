const express = require("express")
const router = express.Router()

const dashboardController = require("../controllers/residentDashboardController");
const authMiddleware = require("../middleware/authMiddleWare");
const paymentController = require("../controllers/paymentController")
const adminController = require("../controllers/adminProfileContoller")

// router.get("/login", (req, res) => {
//     res.status(201).json({
//         data: "Hello"
//     })
// })

router.get(
    "/dashboard",
    authMiddleware,
    dashboardController.getDashboard
);

router.get(
    "/profile",
    authMiddleware,
    adminController.getProfile
)

router.put("/profile", authMiddleware, adminController.updateProfile);

router.post(
    "/pay-now",
    authMiddleware,
    paymentController.payNow
)

router.get(
  "/pending-payments",
  authMiddleware,
  paymentController.getPendingPayments
);

module.exports = router;