const notificationService = require("../services/notificationService");

const getNotifications = async (req, res) => {
    try {
        const adminId = req.user.user_id;
        const data = await notificationService.getNotifications(adminId);
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch notifications" });
    }
};

const sendNotification = async (req, res) => {
    try {
        const adminId = req.user.user_id;
        const result = await notificationService.sendNotification(req.body, adminId);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to send notification" });
    }
};

module.exports = { getNotifications, sendNotification };
