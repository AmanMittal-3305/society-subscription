"use client"

import { useState, useEffect } from "react"
import axios from "axios"

const API = "http://localhost:5000"

export default function MonthlyRecordsPage() {

  const [records,setRecords] = useState<any[]>([])
  const [month,setMonth] = useState("2025-07-01")



  const fetchRecords = async () => {

    try {

      const token = localStorage.getItem("token")

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/monthly-records?month=${month}`,
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      )

      setRecords(res.data)

    } catch(err){
      console.log(err)
    }

  }


  useEffect(()=>{
    fetchRecords()
  },[])



  const markPaid = async (record_id:string) => {

    console.log(record_id);
    

    const token = localStorage.getItem("token")

    await axios.put(
      `${API}/api/admin/monthly-records/${record_id}/mark-paid`,
      {},
      {
        headers:{
          Authorization:`Bearer ${token}`
        }
      }
    )

    fetchRecords()
  }



  return (

    <div style={{padding:"40px"}}>

      <h2>Monthly Subscription Records</h2>

      <div style={{marginBottom:"20px"}}>

        <input
          type="date"
          value={month}
          onChange={(e)=>setMonth(e.target.value)}
        />

        <button onClick={fetchRecords}>
          Load Records
        </button>

      </div>

      <table border={1} cellPadding={10}>

        <thead>
          <tr>
            <th>Flat</th>
            <th>Flat Type</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>

          {records.map((r)=>(
            <tr key={r.record_id}>

              <td>{r.flat_number}</td>
              <td>{r.flat_type}</td>
              <td>{r.monthly_rate}</td>
              <td>{r.status}</td>

              <td>
                {r.status === "PENDING" ? (
                  <button onClick={()=>markPaid(r.record_id)}>
                    Mark Paid
                  </button>
                ) : "Paid"}
              </td>

            </tr>
          ))}

        </tbody>

      </table>

    </div>
  )
}