"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export default function PaymentEntryPage(){

  const [records,setRecords] = useState<any[]>([])
  const [selectedRecord,setSelectedRecord] = useState<any>(null)

  const [month,setMonth] = useState(new Date())

  const [form,setForm] = useState({
    record_id:"",
    // amount_paid:"",
    payment_mode:"CASH",
    payment_source:"OFFLINE",
    transaction_id:""
  })


  const fetchRecords = async()=>{

    try{

      const token = localStorage.getItem("token")

      const formattedMonth =
        month.getFullYear() +
        "-" +
        String(month.getMonth()+1).padStart(2,"0") +
        "-01"

      const res = await axios.get(
        `${API}/api/admin/payment-entry`,
        {
          params:{ month: formattedMonth },
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      )

      setRecords(res.data)

    }catch(err){
      console.log(err)
    }

  }


  useEffect(()=>{
    fetchRecords()
  },[month])



  const handleFlatChange = (record_id:string)=>{

    const record = records.find(r => r.record_id === record_id)

    setSelectedRecord(record)

    setForm({
      ...form,
      record_id:record_id,
      // amount_paid:record.amount
    })

  }



  const handleSubmit = async(e:any)=>{

    e.preventDefault()

    try{

      const token = localStorage.getItem("token")

      await axios.post(
        `${API}/api/admin/payment-entry`,
        form,
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      )

      alert("Payment recorded")

      setSelectedRecord(null)

      setForm({
        record_id:"",
        // amount_paid:"",
        payment_mode:"CASH",
        payment_source:"OFFLINE",
        transaction_id:""
      })

      fetchRecords()

    }catch(err){
      console.log(err)
      alert("Payment failed")
    }

  }



  return(

    <div style={{padding:"40px"}}>

      <h2>Manual Payment Entry</h2>

      <div style={{marginBottom:"20px"}}>

        <label>Select Month</label>

        <br/>

        <DatePicker
          selected={month}
          onChange={(date:any)=>setMonth(date)}
          dateFormat="MMMM yyyy"
          showMonthYearPicker
        />

      </div>



      <form onSubmit={handleSubmit}>

        <div>

          <label>Select Flat</label>

          <select
            required
            value={form.record_id}
            onChange={(e)=>handleFlatChange(e.target.value)}
          >

            <option value="">Select Flat</option>

            {records.map((r)=>(
              <option key={r.record_id} value={r.record_id}>
                Flat {r.flat_number}
              </option>
            ))}

          </select>

        </div>



        {selectedRecord && (

          <div style={{marginTop:"10px"}}>

            Amount Due: ₹{selectedRecord.amount}

          </div>

        )}




        <div style={{marginTop:"10px"}}>

          <label>Payment Mode</label>

          <select
            value={form.payment_mode}
            onChange={(e)=>setForm({...form,payment_mode:e.target.value})}
          >

            <option value="CASH">Cash</option>
            <option value="UPI">UPI</option>
            <option value="NEFT">NEFT</option>
            <option value="CHEQUE">Cheque</option>
            <option value="ONLINE">Online</option>

          </select>

        </div>



        <div style={{marginTop:"10px"}}>

          <label>Transaction ID</label>

          <input
            type="text"
            value={form.transaction_id}
            onChange={(e)=>setForm({...form,transaction_id:e.target.value})}
          />

        </div>



        <button
          type="submit"
          style={{marginTop:"20px"}}
        >
          Record Payment
        </button>

      </form>

    </div>

  )

}