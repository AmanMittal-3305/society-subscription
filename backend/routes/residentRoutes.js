
const express = require("express")
const router = express.Router()

const dashboardController = require("../controllers/residentDashboardController");
const authMiddleware = require("../middleware/authMiddleWare");
const paymentController = require("../controllers/paymentController")
const adminController = require("../controllers/adminProfileContoller")
const residentOnly = require("../middleware/residentMiddleware")

router.use(authMiddleware)
router.use(residentOnly)

// router.get("/login", (req, res) => {
//     res.status(201).json({
//         data: "Hello"
//     })
// })

router.get(
    "/dashboard",
    dashboardController.getDashboard
);

router.get(
    "/profile",
    adminController.getProfile
)

router.put("/profile", authMiddleware, adminController.updateProfile);

router.post(
    "/pay-now",
    paymentController.payNow
)

router.get(
    "/pending-payments",
    paymentController.getPendingPayments
);

module.exports = router;