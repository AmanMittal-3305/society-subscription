"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, Send, Plus, X, Clock, CheckCircle, Users, User } from "lucide-react"

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export default function NotificationPage() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [residents, setResidents] = useState<any[]>([])
  const [showCompose, setShowCompose] = useState(false)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState(false)

  const [form, setForm] = useState({
    recipient_ids: [] as string[],
    title: "",
    message: "",
    send_to_all: true,
  })

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await axios.get(`${API}/api/admin/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setNotifications(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchResidents = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await axios.get(`${API}/api/admin/flats/available-residents`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setResidents(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchNotifications()
    fetchResidents()
  }, [])

  const sendNotification = async () => {
    setSending(true)
    try {
      const token = localStorage.getItem("token")
      await axios.post(`${API}/api/admin/notifications/send`, {
        title: form.title,
        message: form.message,
        send_to_all: form.send_to_all,
        recipient_ids: form.send_to_all ? [] : form.recipient_ids,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setSuccess(true)
      setShowCompose(false)
      setForm({ recipient_ids: [], title: "", message: "", send_to_all: true })
      fetchNotifications()
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error(err)
    } finally {
      setSending(false)
    }
  }

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 min-h-screen bg-slate-50">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Notifications</h1>
          <p className="text-slate-500 mt-1">Send reminders and alerts to residents</p>
        </div>
        <button
          onClick={() => setShowCompose(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-semibold transition-colors shadow-lg shadow-indigo-500/20 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Compose
        </button>
      </div>

      {/* Success Toast */}
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 px-5 py-4 rounded-2xl"
        >
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">Notification sent successfully!</span>
        </motion.div>
      )}

      {/* Notifications List */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-500" />
            Sent Notifications
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <Bell className="w-12 h-12 mx-auto mb-4 text-slate-200" />
            <p className="font-medium">No notifications sent yet</p>
            <p className="text-sm mt-1">Compose your first notification</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {notifications.map((n, i) => (
              <motion.div
                key={n.notification_id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="p-6 hover:bg-slate-50/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                      <Bell className="w-5 h-5 text-indigo-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-[15px]">{n.title}</h3>
                      <p className="text-sm text-slate-500 mt-1 leading-relaxed">{n.message}</p>
                      {n.full_name && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 mt-2">
                          <User className="w-3 h-3" />
                          To: {n.full_name}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 shrink-0 mt-1">
                    <Clock className="w-3.5 h-3.5" />
                    {timeAgo(n.sent_at)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Compose Modal */}
      <AnimatePresence>
        {showCompose && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCompose(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative bg-white rounded-2xl shadow-2xl p-8 w-[500px] max-w-[95vw] border border-slate-100"
            >
              <button
                onClick={() => setShowCompose(false)}
                className="absolute top-4 right-4 p-1 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>

              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Send className="w-5 h-5 text-indigo-500" />
                Compose Notification
              </h2>

              <div className="space-y-4">
                {/* Recipients */}
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">Recipients</label>
                  <div className="flex gap-2 mb-2">
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, send_to_all: true, recipient_ids: [] })}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${form.send_to_all
                          ? "bg-indigo-50 border-indigo-300 text-indigo-700"
                          : "bg-white border-slate-200 text-slate-500"
                        }`}
                    >
                      <Users className="w-4 h-4" />
                      All Residents
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, send_to_all: false })}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${!form.send_to_all
                          ? "bg-indigo-50 border-indigo-300 text-indigo-700"
                          : "bg-white border-slate-200 text-slate-500"
                        }`}
                    >
                      <User className="w-4 h-4" />
                      Specific
                    </button>
                  </div>

                  {!form.send_to_all && (
                    <select
                      multiple
                      value={form.recipient_ids}
                      onChange={(e) => {
                        const selected = Array.from(e.target.selectedOptions, (o) => o.value)
                        setForm({ ...form, recipient_ids: selected })
                      }}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 min-h-[100px]"
                    >
                      {residents.map((r) => (
                        <option key={r.user_id} value={r.user_id}>{r.full_name}</option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Title */}
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Title</label>
                  <input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Payment Reminder for March"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Message</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Write your notification message..."
                    rows={4}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
                  />
                </div>

                <button
                  onClick={sendNotification}
                  disabled={sending || !form.title || !form.message}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-semibold transition-colors shadow-lg shadow-indigo-500/20 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {sending ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Notification
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
