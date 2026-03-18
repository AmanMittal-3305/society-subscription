import { initializeApp } from "firebase/app"
import { getMessaging, getToken } from "firebase/messaging"

const firebaseConfig = {
  apiKey: "AIzaSyBgPmLBLvwXOwH4o2cVlPP_9tM-NSkYtrA",
  authDomain: "society-subscription-413ab.firebaseapp.com",
  projectId: "society-subscription-413ab",
  storageBucket: "society-subscription-413ab.firebasestorage.app",
  messagingSenderId: "931339900026",
  appId: "1:931339900026:web:c6f63c0457747e67ce17c3"
}

const vapidKey =
  "BCHzVajWdPEHQOOglEH_OKIJRAitQ6qVGIPn1gkk-6gx24_pMkLfw1bk7mDvUUrugxAUbwP__lf6Z9xt7R71Tg4"

const app = initializeApp(firebaseConfig)

export const messaging =
  typeof window !== "undefined" ? getMessaging(app) : null

export const requestFCMToken = async () => {
  const permission = await Notification.requestPermission()

  if (permission === "granted" && messaging) {
    const token = await getToken(messaging, {
      vapidKey,
    })

    console.log("FCM Token:", token)

    return token
  }

  return null
}