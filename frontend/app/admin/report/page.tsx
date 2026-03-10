"use client"

import { useEffect, useState } from "react"
import axios from "axios"

const API = "http://localhost:5000"



export default function ReportsPage(){

  const [month,setMonth] = useState("2025-07")

  const [report,setReport] = useState<any>(null)



  const fetchReport = async()=>{

    try{

      const token = localStorage.getItem("token")

      const res = await axios.get(
        `${API}/api/admin/reports/monthly?month=${month}`,
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      )

      setReport(res.data)

    }catch(err){
      console.log(err)
    }

  }



  useEffect(()=>{
    fetchReport()
  },[month])



  const downloadCSV = ()=>{

    if(!report) return

    const rows = [

      ["Month",report.month],

      ["Total Collection",report.total_collection],

      ["Pending Amount",report.pending_amount],

      ["Paid Flats",report.paid_flats],

      ["Pending Flats",report.pending_flats]

    ]



    report.payment_modes.forEach((m:any)=>{

      rows.push([`Mode ${m.payment_mode}`,m.total])

    })



    const csv = rows.map((r:any)=>r.join(",")).join("\n")



    const blob = new Blob([csv],{type:"text/csv"})

    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")

    a.href = url

    a.download = "report.csv"

    a.click()

  }



  return(

    <div style={{padding:"40px"}}>

      <h2>Financial Reports</h2>



      <div>

        <label>Select Month</label>

        <input
          type="month"
          value={month}
          onChange={(e)=>setMonth(e.target.value)}
        />

      </div>



      {report && (

        <div style={{marginTop:"20px"}}>

          <h3>Summary</h3>

          <p>Total Collection: ₹{report.total_collection}</p>

          <p>Pending Amount: ₹{report.pending_amount}</p>

          <p>Paid Flats: {report.paid_flats}</p>

          <p>Pending Flats: {report.pending_flats}</p>



          <h3>Payment Mode Breakdown</h3>

          <ul>

            {report.payment_modes.map((m:any)=>(

              <li key={m.payment_mode}>
                {m.payment_mode} : ₹{m.total}
              </li>

            ))}

          </ul>



          <button onClick={downloadCSV}>
            Download CSV
          </button>

        </div>

      )}

    </div>

  )

}