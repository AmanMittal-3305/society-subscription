"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { jsPDF } from "jspdf"
import {
  FileText,
  Download,
  IndianRupee,
  CheckCircle,
  Clock,
  CreditCard,
  Calendar,
  BarChart3
} from "lucide-react"
import { getMonthlyReport } from "@/services/adminApi"

export default function ReportsPage() {
  const [month, setMonth] = useState(() => {
    const today = new Date()
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`
  })
  const [report, setReport] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const fetchReport = async () => {
    try {
      setLoading(true)
      const res = await getMonthlyReport(month + "-01")
      setReport(res.data)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchReport() }, [month])

  const downloadCSV = () => {
    if (!report) return
    const rows = [
      ["Month", report.month],
      ["Total Collection", report.total_collection],
      ["Pending Amount", report.pending_amount],
      ["Paid Flats", report.paid_flats],
      ["Pending/Unassigned Flats", report.pending_flats]
    ]
    report.payment_modes.forEach((m: any) => {
      rows.push([`Mode ${m.payment_mode}`, m.total])
    })
    const csv = rows.map((r: any) => r.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `report-${report.month}.csv`
    a.click()
  }

  const downloadPDF = () => {
    if (!report) return
    const doc = new jsPDF()
    let y = 20
    doc.setFontSize(16)
    doc.text("Monthly Financial Report", 20, y)
    y += 15
    doc.setFontSize(12)
    doc.text(`Month: ${report.month}`, 20, y); y += 10
    doc.text(`Total Collection: Rs.${report.total_collection}`, 20, y); y += 10
    doc.text(`Pending Amount: Rs.${report.pending_amount}`, 20, y); y += 10
    doc.text(`Paid Flats: ${report.paid_flats}`, 20, y); y += 10
    doc.text(`Pending/Unassigned Flats: ${report.pending_flats}`, 20, y); y += 15
    doc.text("Payment Mode Breakdown:", 20, y); y += 10
    report.payment_modes.forEach((m: any) => {
      doc.text(`${m.payment_mode}: Rs.${m.total}`, 20, y); y += 10
    })
    doc.save(`report-${report.month}.pdf`)
  }

  const totalModeAmount = report?.payment_modes?.reduce((sum: number, m: any) => sum + parseFloat(m.total || 0), 0) || 1

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 min-h-screen bg-slate-50">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Financial Reports</h1>
          <p className="text-slate-500 mt-1">Monthly financial summaries and breakdowns</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={downloadCSV}
            disabled={!report}
            className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl flex items-center gap-2 font-semibold hover:bg-slate-50 transition-colors disabled:opacity-40 text-sm shadow-sm"
          >
            <Download className="w-4 h-4" />
            CSV
          </button>
          <button
            onClick={downloadPDF}
            disabled={!report}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 font-semibold transition-colors disabled:opacity-40 text-sm shadow-lg shadow-indigo-500/20"
          >
            <Download className="w-4 h-4" />
            PDF
          </button>
        </div>
      </div>

      {/* Month Selector */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <label className="text-sm font-semibold text-slate-700 mb-2 block flex items-center gap-2">
          <Calendar className="w-4 h-4 text-indigo-500" />
          Report Month
        </label>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="w-full max-w-xs px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
        />
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
        </div>
      )}

      {report && !loading && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Total Collection", value: `₹${parseFloat(report.total_collection || 0).toLocaleString()}`, icon: IndianRupee, color: "emerald" },
              { title: "Pending Amount", value: `₹${parseFloat(report.pending_amount || 0).toLocaleString()}`, icon: Clock, color: "amber" },
              { title: "Paid Flats", value: report.paid_flats || 0, icon: CheckCircle, color: "emerald" },
              { title: "Pending/Unassigned Flats", value: report.pending_flats || 0, icon: Clock, color: "amber" },
            ].map((stat, i) => {
              const Icon = stat.icon
              const isPositive = stat.color === "emerald"
              return (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2.5 rounded-xl ${isPositive ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">{stat.value}</p>
                </motion.div>
              )
            })}
          </div>

          {/* Payment Mode Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8"
          >
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-6">
              <BarChart3 className="w-5 h-5 text-indigo-500" />
              Payment Mode Breakdown
            </h2>

            {report.payment_modes.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <CreditCard className="w-10 h-10 mx-auto mb-3 text-slate-200" />
                <p>No payments recorded for this month</p>
              </div>
            ) : (
              <div className="space-y-4">
                {report.payment_modes.map((m: any) => {
                  const percentage = Math.round((parseFloat(m.total) / totalModeAmount) * 100)
                  return (
                    <div key={m.payment_mode}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-slate-700">{m.payment_mode}</span>
                        <span className="text-sm font-bold text-slate-900">₹{parseFloat(m.total).toLocaleString()} ({percentage}%)</span>
                      </div>
                      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full"
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </motion.div>
        </>
      )}

      {!report && !loading && (
        <div className="text-center py-20 text-slate-400">
          <FileText className="w-12 h-12 mx-auto mb-4 text-slate-200" />
          <p className="font-medium">No report data available</p>
          <p className="text-sm mt-1">Select a month to generate the report</p>
        </div>
      )}
    </div>
  )
}