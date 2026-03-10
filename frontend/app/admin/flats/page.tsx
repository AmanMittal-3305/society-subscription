"use client"

import { useEffect, useState } from "react"
import axios from "axios"

export default function FlatsPage() {

  const [flats, setFlats] = useState([])
  const [search, setSearch] = useState("")

  const API = process.env.NEXT_PUBLIC_API_URL

  const fetchFlats = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await axios.get(`${API}/api/admin/flats`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      setFlats(res.data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchFlats()
  }, [])

  const deleteFlat = async (id: string) => {
    try {3
      await axios.delete(`${API}/api/admin/flats/${id}`)
      fetchFlats()
    } catch (error) {
      console.error(error)
    }
  }

  const filteredFlats = flats.filter((flat: any) =>
    flat.flat_number.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-8">

      <h1 className="text-2xl font-bold mb-6">Flats Management</h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search flat number..."
        className="border p-2 mb-4 w-64"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Flats Table */}

      <table className="w-full border">

        <thead className="bg-gray-200 text-black">
          <tr>
            <th className="p-2">Flat Number</th>
            <th className="p-2">Flat Type</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>

        <tbody>

          {filteredFlats.map((flat: any) => (
            <tr key={flat.flat_id} className="border-t">

              <td className="p-2">{flat.flat_number}</td>
              <td className="p-2">{flat.flat_type}</td>

              <td className="p-2 space-x-2">

                <button
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteFlat(flat.flat_id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>

              </td>

            </tr>
          ))}

        </tbody>

      </table>

    </div>
  )
}