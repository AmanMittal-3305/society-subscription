importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBgPmLBLvwXOwH4o2cVlPP_9tM-NSkYtrA",
  authDomain: "society-subscription-413ab.firebaseapp.com",
  projectId: "society-subscription-413ab",
  storageBucket: "society-subscription-413ab.firebasestorage.app",
  messagingSenderId: "931339900026",
  appId: "1:931339900026:web:c6f63c0457747e67ce17c3"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log("Background message:", payload);

  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
  });
});