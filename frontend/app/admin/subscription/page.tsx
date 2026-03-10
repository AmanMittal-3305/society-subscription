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

  // Fetch Plans
  const fetchPlans = async () => {
    try {

      const token = localStorage.getItem("token")

      const res = await axios.get(`${API}/api/admin/subscriptions`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setPlans(res.data)

    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchPlans()
  }, [])

  // Create Plan
  const createPlan = async () => {
    try {

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

    } catch (error) {
      console.error(error)
    }
  }

  // Delete Plan
  const deletePlan = async (id: string) => {
    try {

      const token = localStorage.getItem("token")

      await axios.delete(`${API}/api/admin/subscriptions/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      fetchPlans()

    } catch (error) {
      console.error(error)
    }
  }

  // Update Plan
  const updatePlan = async () => {
    try {

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

    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div style={{ padding: "40px" }}>

      <h1>Subscription Plans</h1>

      {/* Create Plan */}

      <h2>Create Plan</h2>

      <input
        placeholder="Flat Type (1BHK)"
        value={flatType}
        onChange={(e) => setFlatType(e.target.value)}
      />

      <input
        placeholder="Monthly Rate"
        value={monthlyRate}
        onChange={(e) => setMonthlyRate(e.target.value)}
      />

      <button onClick={createPlan}>Create</button>


      <hr style={{ margin: "30px 0" }} />


      {/* Plan List */}

      <h2>All Plans</h2>

      {plans.map((plan) => (

        <div
          key={plan.plan_id}
          style={{
            border: "1px solid gray",
            padding: "10px",
            marginBottom: "10px"
          }}
        >

          <h3>{plan.flat_type}</h3>

          {editId === plan.plan_id ? (

            <>
              <input
                value={editRate}
                onChange={(e) => setEditRate(e.target.value)}
              />

              <button onClick={updatePlan}>
                Save
              </button>

              <button onClick={() => setEditId(null)}>
                Cancel
              </button>
            </>

          ) : (

            <>
              <p>₹{plan.monthly_rate}</p>

              <button
                onClick={() => {
                  setEditId(plan.plan_id)
                  setEditRate(plan.monthly_rate)
                }}
              >
                Edit
              </button>

              <button
                onClick={() => deletePlan(plan.plan_id)}
              >
                Delete
              </button>
            </>
          )}

        </div>

      ))}

    </div>
  )
}