"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { jsPDF } from "jspdf"


const API = "http://localhost:5000"

export default function ReportsPage() {

  const [month, setMonth] = useState(new Date())
  const [report, setReport] = useState<any>(null)

  const fetchReport = async () => {

    try {

      const token = localStorage.getItem("token")

      const formattedMonth =
        month.getFullYear() +
        "-" +
        String(month.getMonth() + 1).padStart(2, "0") +
        "-01"

      console.log(formattedMonth)

      const res = await axios.get(
        `${API}/api/admin/reports/monthly`,
        {
          params: { month: formattedMonth },
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setReport(res.data)

    } catch (err) {
      console.log(err)
    }

  }

  useEffect(() => {
    fetchReport()
  }, [month])


  const downloadCSV = () => {

    if (!report) return

    const rows = [

      ["Month", report.month],
      ["Total Collection", report.total_collection],
      ["Pending Amount", report.pending_amount],
      ["Paid Flats", report.paid_flats],
      ["Pending Flats", report.pending_flats]

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

    doc.text(`Month: ${report.month}`, 20, y)
    y += 10

    doc.text(`Total Collection: ₹${report.total_collection}`, 20, y)
    y += 10

    doc.text(`Pending Amount: ₹${report.pending_amount}`, 20, y)
    y += 10

    doc.text(`Paid Flats: ${report.paid_flats}`, 20, y)
    y += 10

    doc.text(`Pending Flats: ${report.pending_flats}`, 20, y)
    y += 15

    doc.text("Payment Mode Breakdown:", 20, y)
    y += 10

    report.payment_modes.forEach((m: any) => {
      doc.text(`${m.payment_mode}: ₹${m.total}`, 20, y)
      y += 10
    })

    doc.save(`report-${report.month}.pdf`)
  }


  return (

    <div style={{ padding: "40px" }}>

      <h2>Financial Reports</h2>

      <div style={{ marginBottom: "20px" }}>

        <label>Select Month</label>

        <br />

        <DatePicker
          selected={month}
          onChange={(date: any) => setMonth(date)}
          dateFormat="MM/yyyy"
          showMonthYearPicker
        />

      </div>

      {report && (

        <div style={{ marginTop: "20px" }}>

          <h3>Summary</h3>

          <p>Total Collection: ₹{report.total_collection}</p>
          <p>Pending Amount: ₹{report.pending_amount}</p>
          <p>Paid Flats: {report.paid_flats}</p>
          <p>Pending Flats: {report.pending_flats}</p>

          <h3>Payment Mode Breakdown</h3>

          <ul>

            {report.payment_modes.map((m: any) => (
              <li key={m.payment_mode}>
                {m.payment_mode} : ₹{m.total}
              </li>
            ))}

          </ul>

          <button onClick={downloadCSV}>
            Download CSV
          </button>

          <button onClick={downloadPDF}> Download PDF</button>

        </div>

      )}

    </div>

  )

}