"use client"

import { useEffect, useState } from "react"
import axios from "axios"

const API = process.env.NEXT_PUBLIC_API_URL

export default function SubscriptionPage() {

  const [plans, setPlans] = useState<any[]>([])

  const [flatType, setFlatType] = useState("")
  const [monthlyRate, setMonthlyRate] = useState("")

  const [editId, setEditId] = useState<string | null>(null)
  const [editRate, setEditRate] = useState("")

  // FETCH
  const fetchPlans = async () => {

    const token = localStorage.getItem("token")

    const res = await axios.get(

      `${API}/api/admin/subscriptions`,

      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    setPlans(res.data)
  }

  useEffect(() => {
    fetchPlans()
  }, [])

  // CREATE
  const createPlan = async () => {

    const token = localStorage.getItem("token")

    await axios.post(

      `${API}/api/admin/subscriptions`,

      {
        flat_type: flatType,
        monthly_rate: monthlyRate
      },

      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    setFlatType("")
    setMonthlyRate("")

    fetchPlans()
  }

  // DELETE
  const deletePlan = async (id: string) => {

    const token = localStorage.getItem("token")

    await axios.delete(

      `${API}/api/admin/subscriptions/${id}`,

      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    fetchPlans()
  }

  // UPDATE
  const updatePlan = async () => {

    const token = localStorage.getItem("token")

    await axios.put(

      `${API}/api/admin/subscriptions/${editId}`,

      {
        monthly_rate: editRate
      },

      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    setEditId(null)
    setEditRate("")

    fetchPlans()
  }

  return (

    <div className="p-10 max-w-4xl mx-auto">

      <h1 className="text-3xl font-bold mb-8">
        Subscription Plans
      </h1>

      {/* CREATE */}

      <div className="bg-white shadow p-6 rounded mb-10">

        <h2 className="text-xl mb-4">
          Create Plan
        </h2>

        <div className="flex gap-3">

          <input
            className="border p-2 rounded"
            placeholder="Flat Type"
            value={flatType}
            onChange={(e) => setFlatType(e.target.value)}
          />

          <input
            className="border p-2 rounded"
            placeholder="Monthly Rate"
            value={monthlyRate}
            onChange={(e) => setMonthlyRate(e.target.value)}
          />

          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={createPlan}
          >
            Create
          </button>

        </div>
      </div>

      {/* LIST */}

      <div className="grid gap-4">

        {plans.map((plan) => (
          <div
            key={plan.plan_id}
            className="border p-4 rounded flex justify-between items-center"
          >

            <div>

              <h3 className="font-semibold">
                {plan.flat_type}
              </h3>

              {editId === plan.plan_id ? (

                <input
                  className="border p-1 mt-1"
                  value={editRate}
                  onChange={(e) => setEditRate(e.target.value)}
                />

              ) : (

                <p>₹{plan.monthly_rate}</p>

              )}

            </div>

            <div className="flex gap-2">

              {editId === plan.plan_id ? (

                <>
                  <button
                    className="bg-green-600 text-white px-3 py-1 rounded"
                    onClick={updatePlan}
                  >
                    Save
                  </button>

                  <button
                    className="bg-gray-400 text-white px-3 py-1 rounded"
                    onClick={() => setEditId(null)}
                  >
                    Cancel
                  </button>
                </>

              ) : (

                <>
                  <button
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                    onClick={() => {
                      setEditId(plan.plan_id)
                      setEditRate(plan.monthly_rate)
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() => deletePlan(plan.plan_id)}
                  >
                    Delete
                  </button>
                </>

              )}

            </div>

          </div>
        ))}

      </div>

    </div>
  )
}