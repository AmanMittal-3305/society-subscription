"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { requestFCMToken } from "@/lib/firebase"

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export default function ResidentNotifications() {
  const [notifications, setNotifications] = useState<any[]>([])

  const fetchNotifications = async () => {
    const token = localStorage.getItem("token")

    const res = await axios.get(`${API}/api/resident/notifications`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    setNotifications(res.data)
  }

  const saveToken = async () => {
    const fcm = await requestFCMToken()

    if (fcm) {
      const token = localStorage.getItem("token")

      await axios.put(
        `${API}/api/resident/save-token`,
        { token: fcm },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
    }
  }

  useEffect(() => {
    saveToken()
    fetchNotifications()
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>

      <div className="space-y-4">
        {notifications.map((n) => (
          <div key={n.notification_id} className="p-4 border rounded-xl">
            <h3 className="font-bold">{n.title}</h3>
            <p>{n.message}</p>
          </div>
        ))}
      </div>
    </div>
  )
}