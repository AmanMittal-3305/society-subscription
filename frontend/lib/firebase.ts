import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBgPmLBLvwXOwH4o2cVlPP_9tM-NSkYtrA",
  authDomain: "society-subscription-413ab.firebaseapp.com",
  projectId: "society-subscription-413ab",
  storageBucket: "society-subscription-413ab.firebasestorage.app",
  messagingSenderId: "931339900026",
  appId: "1:931339900026:web:c6f63c0457747e67ce17c3"
};

const vapidKey = "BCHzVajWdPEHQOOglEH_OKIJRAitQ6qVGIPn1gkk-6gx24_pMkLfw1bk7mDvUUrugxAUbwP__lf6Z9xt7R71Tg4";

const app = initializeApp(firebaseConfig);
export const messaging = typeof window !== "undefined" ? getMessaging(app) : null;

/**
 * Request permission and get FCM token
 */
export const requestFCMToken = async (): Promise<string | null> => {
  if (!messaging) return null;

  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("Notification permission not granted");
      return null;
    }

    const token = await getToken(messaging, { vapidKey });
    if (token) {
      console.log("FCM Token:", token);
      // ⚡ Important: send this token to your backend immediately
      // Example: await fetch('/api/save-token', { method: 'POST', body: JSON.stringify({ token }) });
      return token;
    } else {
      console.log("No registration token available");
      return null;
    }
  } catch (err) {
    console.error("Error getting FCM token:", err);
    return null;
  }
};

/**
 * Listen to foreground messages
 */
export const onForegroundMessage = (callback: (payload: any) => void) => {
  if (!messaging) return;

  onMessage(messaging, (payload) => {
    console.log("Foreground message received:", payload);

    // ⚡ Manually show notification in foreground
    if (payload.notification) {
      new Notification(payload.notification.title, {
        body: payload.notification.body,
        icon: payload.notification.icon || "/favicon.ico",
      });
    }

    callback(payload);
  });
};

/**
 * Register service worker (important for background messages)
 */
export const registerServiceWorker = async () => {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js"
      );
      console.log("Service Worker registered:", registration);
      return registration;
    } catch (err) {
      console.error("Service Worker registration failed:", err);
      return null;
    }
  }
  return null;
};