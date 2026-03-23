"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { getResidentNotifications, markNotificationsRead } from "@/services/residentApi";

export default function ResidentNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);

  const fetchNotifications = async () => {
    try {
      const res = await getResidentNotifications();

      // Keep only unique notifications
      const unique = Array.from(
        new Map(res.data.map((item: any) => [item.notification_id, item])).values()
      );
      setNotifications(unique);
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAsRead = async () => {
    try {
      await markNotificationsRead();
    } catch (err) {
      console.error(err);
    }
  };

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  useEffect(() => {
    fetchNotifications();
    handleMarkAsRead();
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto min-h-screen bg-slate-50">
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Notifications</h1>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <p>No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((n) => (
            <div
              key={n.notification_id}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">{n.title}</h3>
                  <p className="text-slate-600 mt-2 leading-relaxed">{n.message}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-400 shrink-0">
                  <Clock className="w-3.5 h-3.5" />
                  {timeAgo(n.created_at)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}