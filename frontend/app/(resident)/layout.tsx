"use client";

import ResidentSidebar from "@/components/ResidentSidebar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { Bell, User } from "lucide-react";
import Link from "next/link";
import { messaging, registerServiceWorker } from "@/lib/firebase";
import { getToken, onMessage } from "firebase/messaging";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ResidentLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [hasUnread, setHasUnread] = useState(false);

  // Fetch unread notifications count
  const fetchUnread = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/api/resident/notifications/unread`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHasUnread(res.data.unread > 0);
    } catch (err) {
      console.error("Unread fetch error:", err);
    }
  };

  // Setup Firebase Messaging
  const setupFirebase = async () => {
    try {
      if (!messaging) return;

      const permission = await Notification.requestPermission();
      if (permission !== "granted") return;

      // Register service worker
      await registerServiceWorker();

      // Get FCM token
      const fcmToken = await getToken(messaging, {
        vapidKey:
          "BCHzVajWdPEHQOOglEH_OKIJRAitQ6qVGIPn1gkk-6gx24_pMkLfw1bk7mDvUUrugxAUbwP__lf6Z9xt7R71Tg4",
      });

      if (fcmToken) {
        const authToken = localStorage.getItem("token");
        await axios.put(
          `${API}/api/resident/save-token`,
          { token: fcmToken },
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
      }

      // Listen for foreground messages
      onMessage(messaging, (payload) => {
        console.log("Firebase payload:", payload);

        if (payload.notification) {
          new Notification(payload.notification.title, {
            body: payload.notification.body,
            icon: payload.notification.icon || "/favicon.ico",
          });
        }

        fetchUnread();
        window.dispatchEvent(new Event("notification-received"));
      });
    } catch (err) {
      console.error("Firebase setup error:", err);
    }
  };

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "RESIDENT") {
      router.push("/login");
      return;
    }

    fetchUnread();
    setupFirebase();

    // Poll unread notifications every 5 seconds
    const interval = setInterval(fetchUnread, 5000);

    const handleNotificationEvent = () => fetchUnread();
    window.addEventListener("notification-received", handleNotificationEvent);

    return () => {
      clearInterval(interval);
      window.removeEventListener("notification-received", handleNotificationEvent);
    };
  }, [router]);

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans">
      <ResidentSidebar />

      <div className="flex-1 flex flex-col w-full">
        {/* Top Navbar */}
        <div className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-end gap-5 sticky top-0 z-30">
          {/* Bell */}
          <Link href="/notification" className="relative">
            <Bell className="w-6 h-6 text-slate-700 hover:text-indigo-600 transition" />
            {hasUnread && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full" />
            )}
          </Link>

          {/* Profile */}
          <Link href="/profile">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center hover:bg-indigo-200 transition">
              <User className="w-5 h-5 text-indigo-600" />
            </div>
          </Link>
        </div>

        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}