const admin = require("../config/firebase");

const sendPushNotification = async (deviceToken, title, body) => {
  try {
    const message = {
      notification: {
        title,
        body,
      },
      token: deviceToken,
    };

    await admin.messaging().send(message);

  } catch (e) {
    console.error("Firebase send error:", e.message);
  }
};

module.exports = {
  sendPushNotification,
};