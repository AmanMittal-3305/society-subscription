"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"
import { CreditCard, Plus, Edit2, Trash2, X, Save, IndianRupee } from "lucide-react"

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

const typeColors: Record<string, string> = {
  "1BHK": "from-blue-500 to-cyan-500",
  "2BHK": "from-indigo-500 to-violet-500",
  "3BHK": "from-emerald-500 to-teal-500",
  "4BHK": "from-amber-500 to-orange-500",
}

const typeBg: Record<string, string> = {
  "1BHK": "bg-blue-50 text-blue-700 border-blue-200",
  "2BHK": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "3BHK": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "4BHK": "bg-amber-50 text-amber-700 border-amber-200",
}

export default function SubscriptionPage() {
  const [plans, setPlans] = useState<any[]>([])
  const [showModal, setShowModal] = useState(false)
  const [flatType, setFlatType] = useState("1BHK")
  const [monthlyRate, setMonthlyRate] = useState("")
  const [editId, setEditId] = useState<string | null>(null)
  const [editRate, setEditRate] = useState("")

  const fetchPlans = async () => {
    const token = localStorage.getItem("token")
    const res = await axios.get(`${API}/api/admin/subscriptions`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    setPlans(res.data)
  }

  useEffect(() => { fetchPlans() }, [])

  const createPlan = async () => {
    const token = localStorage.getItem("token")
    await axios.post(`${API}/api/admin/subscriptions`, { flat_type: flatType, monthly_rate: monthlyRate }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    setFlatType("1BHK")
    setMonthlyRate("")
    setShowModal(false)
    fetchPlans()
  }

  const deletePlan = async (id: string) => {
    const token = localStorage.getItem("token")
    await axios.delete(`${API}/api/admin/subscriptions/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    fetchPlans()
  }

  const updatePlan = async () => {
    const token = localStorage.getItem("token")
    await axios.put(`${API}/api/admin/subscriptions/${editId}`, { monthly_rate: editRate }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    setEditId(null)
    setEditRate("")
    fetchPlans()
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 min-h-screen bg-slate-50">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Subscription Plans</h1>
          <p className="text-slate-500 mt-1">Manage monthly subscription rates by flat type</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-semibold transition-colors shadow-lg shadow-indigo-500/20 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Add Plan
        </button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {plans.map((plan, i) => {
          const gradient = typeColors[plan.flat_type] || "from-slate-500 to-slate-600"
          const badge = typeBg[plan.flat_type] || "bg-slate-50 text-slate-700 border-slate-200"
          const isEditing = editId === plan.plan_id

          return (
            <motion.div
              key={plan.plan_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden group hover:shadow-md transition-all hover:-translate-y-0.5"
            >
              {/* Gradient Header */}
              <div className={`h-2 bg-gradient-to-r ${gradient}`} />

              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${badge} uppercase tracking-wider`}>
                    {plan.flat_type}
                  </span>
                  <CreditCard className="w-5 h-5 text-slate-300" />
                </div>

                {isEditing ? (
                  <div className="space-y-3">
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-lg font-bold"
                        value={editRate}
                        onChange={(e) => setEditRate(e.target.value)}
                        autoFocus
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors"
                        onClick={updatePlan}
                      >
                        <Save className="w-3.5 h-3.5" />
                        Save
                      </button>
                      <button
                        className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                        onClick={() => setEditId(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mb-4">
                      <p className="text-sm text-slate-500 font-medium">Monthly Rate</p>
                      <p className="text-3xl font-bold text-slate-900 mt-1 tracking-tight">
                        ₹{parseFloat(plan.monthly_rate).toLocaleString()}
                        <span className="text-sm font-normal text-slate-400">/month</span>
                      </p>
                    </div>

                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        className="flex-1 bg-slate-100 hover:bg-amber-50 hover:text-amber-600 text-slate-600 px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                        onClick={() => {
                          setEditId(plan.plan_id)
                          setEditRate(plan.monthly_rate)
                        }}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        Edit
                      </button>
                      <button
                        className="flex-1 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                        onClick={() => deletePlan(plan.plan_id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {plans.length === 0 && (
        <div className="text-center py-20 text-slate-400">
          <CreditCard className="w-12 h-12 mx-auto mb-4 text-slate-200" />
          <p className="font-medium">No subscription plans yet</p>
          <p className="text-sm mt-1">Create your first plan to get started</p>
        </div>
      )}

      {/* Create Plan Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative bg-white rounded-2xl shadow-2xl p-8 w-[420px] max-w-[95vw] border border-slate-100"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 p-1 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>

              <h2 className="text-xl font-bold text-slate-900 mb-6">Create New Plan</h2>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Flat Type</label>
                  <select
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    value={flatType}
                    onChange={(e) => setFlatType(e.target.value)}
                  >
                    <option>1BHK</option>
                    <option>2BHK</option>
                    <option>3BHK</option>
                    <option>4BHK</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Monthly Rate (₹)</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      placeholder="e.g. 5000"
                      value={monthlyRate}
                      onChange={(e) => setMonthlyRate(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  onClick={createPlan}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-semibold transition-colors shadow-lg shadow-indigo-500/20 active:scale-[0.98]"
                >
                  Create Plan
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}