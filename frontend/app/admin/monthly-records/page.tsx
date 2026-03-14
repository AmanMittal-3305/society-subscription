"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { motion } from "framer-motion"
import { Calendar, Search, CheckCircle, Clock, FileText } from "lucide-react"

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export default function MonthlyRecordsPage() {
  const [records, setRecords] = useState<any[]>([])
  const [month, setMonth] = useState(() => {
    const today = new Date()
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-01`
  })

  const fetchRecords = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await axios.get(`${API}/api/admin/monthly-records`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { month }
      })
      setRecords(res.data)
    } catch (err) {
      console.error("Error fetching records:", err)
    }
  }

  useEffect(() => {
    fetchRecords()
  }, [month])

  const markPaid = async (record_id: string) => {
    try {
      const token = localStorage.getItem("token")
      await axios.put(
        `${API}/api/admin/monthly-records/${record_id}/mark-paid`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      fetchRecords()
    } catch (err) {
      console.error("Error marking paid:", err)
    }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 min-h-screen bg-slate-50">
      <h1 className="text-3xl font-bold text-slate-900">Monthly Records</h1>

      <motion.div className="bg-white p-6 rounded-2xl border shadow-sm flex gap-4 items-end">
        <div className="flex-1">
          <label className="text-sm font-medium text-slate-700">Select Month</label>
          <input
            type="month"
            value={month.slice(0, 7)}
            onChange={(e) => setMonth(e.target.value + "-01")}
            className="mt-1 w-full p-2.5 border rounded-xl"
          />
        </div>
        <button
          onClick={fetchRecords}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2"
        >
          <Search className="w-4 h-4" />
          Load Records
        </button>
      </motion.div>

      <motion.div className="bg-white rounded-3xl border shadow-sm overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50/50 text-slate-500 font-medium border-b">
            <tr>
              <th className="px-6 py-4">Flat No</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {records.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center gap-2">
                    <FileText className="w-8 h-8 text-slate-200" />
                    <p>No records found for the selected month.</p>
                  </div>
                </td>
              </tr>
            ) : (
              records.map((r) => (
                <tr key={r.record_id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-bold">{r.flat_number}</td>
                  <td className="px-6 py-4">{r.flat_type}</td>
                  <td className="px-6 py-4">₹{r.amount}</td>
                  <td className="px-6 py-4">
                    {r.status === "PAID" ? (
                      <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-lg text-xs font-bold uppercase">
                        <CheckCircle className="w-3.5 h-3.5" /> Paid
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-600 px-2.5 py-1 rounded-lg text-xs font-bold uppercase">
                        <Clock className="w-3.5 h-3.5" /> Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {r.status === "PENDING" ? (
                      <button
                        onClick={() => markPaid(r.record_id)}
                        className="bg-emerald-600 text-white px-4 py-1.5 rounded-lg text-xs font-semibold"
                      >
                        Mark Paid
                      </button>
                    ) : (
                      <span className="text-slate-300 text-xs">No Action</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </motion.div>
    </div>
  )
}