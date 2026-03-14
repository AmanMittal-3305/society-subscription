"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import {
  Plus,
  Edit2,
  Trash2
} from "lucide-react"

export default function FlatsPage() {
  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

  const [flats, setFlats] = useState<any[]>([])
  const [search, setSearch] = useState("")

  const [flatNumber, setFlatNumber] = useState("")
  const [ownerName, setOwnerName] = useState("")
  const [flatType, setFlatType] = useState("1BHK")
  const [address, setAddress] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  const [showResidentModal, setShowResidentModal] = useState(false)
  const [showRegisterModal, setShowRegisterModal] = useState(false)

  const [selectedFlat, setSelectedFlat] = useState("")
  const [residents, setResidents] = useState<any[]>([])
  const [selectedResident, setSelectedResident] = useState("")

  const [newResidentName, setNewResidentName] = useState("")
  const [newResidentEmail, setNewResidentEmail] = useState("")
  const [newResidentPhone, setNewResidentPhone] = useState("")

  const fetchFlats = async () => {
    try {
      const token = localStorage.getItem("token")

      const res = await axios.get(`${API}/api/admin/flats`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setFlats(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const fetchResidents = async () => {
    try {
      const token = localStorage.getItem("token")

      const res = await axios.get(`${API}/api/admin/flats/available-residents`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setResidents(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchFlats()
  }, [])

  const saveFlat = async () => {
    try {
      const token = localStorage.getItem("token")

      if (editingId) {
        await axios.put(
          `${API}/api/admin/flats/${editingId}`,
          {
            flat_number: flatNumber,
            owner_name: ownerName,
            flat_type: flatType,
            address
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
      } else {
        await axios.post(
          `${API}/api/admin/flats`,
          {
            flat_number: flatNumber,
            owner_name: ownerName,
            flat_type: flatType,
            address
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
      }

      setFlatNumber("")
      setOwnerName("")
      setFlatType("1BHK")
      setAddress("")
      setEditingId(null)
      setShowForm(false)

      fetchFlats()
    } catch (err) {
      console.error(err)
    }
  }

  const deleteFlat = async (id: string) => {
    try {
      const token = localStorage.getItem("token")

      await axios.delete(`${API}/api/admin/flats/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      fetchFlats()
    } catch (err) {
      console.error(err)
    }
  }

  const handleEdit = (flat: any) => {
    setEditingId(flat.flat_id)
    setFlatNumber(flat.flat_number)
    setOwnerName(flat.owner_name)
    setFlatType(flat.flat_type)
    setAddress(flat.address)
    setShowForm(true)
  }

  const openResidentModal = async (flatId: string) => {
    setSelectedFlat(flatId)
    setSelectedResident("")
    await fetchResidents()
    setShowResidentModal(true)
  }

  const assignResident = async () => {
    try {
      const token = localStorage.getItem("token")

      await axios.put(
        `${API}/api/admin/flats/${selectedFlat}/assign-resident`,
        {
          resident_id: selectedResident
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setSelectedResident("")
      setShowResidentModal(false)

      fetchFlats()
    } catch (err) {
      console.error(err)
    }
  }

  const registerResident = async () => {
    try {
      const token = localStorage.getItem("token")

      await axios.post(
        `${API}/api/admin/flats/${selectedFlat}/register-resident`,
        {
          full_name: newResidentName,
          email: newResidentEmail,
          phone_number: newResidentPhone
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setNewResidentName("")
      setNewResidentEmail("")
      setNewResidentPhone("")

      await fetchResidents()

      setShowRegisterModal(false)
      setShowResidentModal(true)

    } catch (err) {
      console.error(err)
    }
  }

  const filteredFlats = flats.filter((flat) =>
    flat.flat_number?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 min-h-screen bg-slate-50">

      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Flats Management</h1>

        <button
          onClick={() => {
            setShowForm(true)
            setEditingId(null)
            setFlatNumber("")
            setOwnerName("")
            setFlatType("1BHK")
            setAddress("")
          }}
          className="bg-indigo-600 text-white px-5 py-2 rounded-xl flex gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Flat
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-2xl shadow">
          <div className="grid grid-cols-4 gap-4">

            <input
              className="border p-2 rounded"
              placeholder="Flat Number"
              value={flatNumber}
              onChange={(e) => setFlatNumber(e.target.value)}
            />

            <input
              className="border p-2 rounded"
              placeholder="Owner Name"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
            />

            <select
              className="border p-2 rounded"
              value={flatType}
              onChange={(e) => setFlatType(e.target.value)}
            >
              <option>1BHK</option>
              <option>2BHK</option>
              <option>3BHK</option>
              <option>4BHK</option>
            </select>

            <input
              className="border p-2 rounded"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={saveFlat}
              className="bg-indigo-600 text-white px-5 py-2 rounded"
            >
              Save
            </button>

            <button
              onClick={() => setShowForm(false)}
              className="px-5 py-2 border rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <input
        className="border p-2 rounded w-full"
        placeholder="Search flat"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <table className="w-full bg-white rounded-xl shadow overflow-hidden">
        <thead>
          <tr className="bg-slate-100">
            <th className="p-4">Flat</th>
            <th>Owner</th>
            <th>Resident</th>
            <th>Type</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredFlats.map((flat) => (
            <tr key={flat.flat_id} className="border-t">

              <td className="p-4">{flat.flat_number}</td>
              <td>{flat.owner_name}</td>

              <td>
                {flat.resident_name ? (
                  flat.resident_name
                ) : (
                  <button
                    onClick={() => openResidentModal(flat.flat_id)}
                    className="text-indigo-600"
                  >
                    Add Resident
                  </button>
                )}
              </td>

              <td>{flat.flat_type}</td>
              <td>{flat.address}</td>

              <td className="flex gap-2 p-4">
                <button onClick={() => handleEdit(flat)}>
                  <Edit2 className="w-4 h-4" />
                </button>

                <button onClick={() => deleteFlat(flat.flat_id)}>
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>

      {showResidentModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-40">

          <div className="bg-white p-6 rounded-2xl w-[400px] space-y-4">

            <h2 className="text-xl font-bold">Add Resident</h2>

            <select
              className="w-full border p-2 rounded"
              value={selectedResident}
              onChange={(e) => setSelectedResident(e.target.value)}
            >
              <option value="">Select Existing Resident</option>

              {residents.map((r) => (
                <option key={r.user_id} value={r.user_id}>
                  {r.full_name}
                </option>
              ))}
            </select>

            <button
              onClick={assignResident}
              className="w-full bg-indigo-600 text-white py-2 rounded"
            >
              Assign Existing Resident
            </button>

            <hr />

            <button
              onClick={() => {
                setShowResidentModal(false)
                setShowRegisterModal(true)
              }}
              className="w-full bg-green-600 text-white py-2 rounded"
            >
              + Add New Resident
            </button>

            <button
              onClick={() => setShowResidentModal(false)}
              className="w-full border py-2 rounded"
            >
              Cancel
            </button>

          </div>

        </div>
      )}

      {showRegisterModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

          <div className="bg-white p-6 rounded-2xl w-[400px] space-y-4">

            <h2 className="text-xl font-bold">Register New Resident</h2>

            <input
              placeholder="Full Name"
              className="w-full border p-2 rounded"
              value={newResidentName}
              onChange={(e) => setNewResidentName(e.target.value)}
            />

            <input
              placeholder="Email"
              className="w-full border p-2 rounded"
              value={newResidentEmail}
              onChange={(e) => setNewResidentEmail(e.target.value)}
            />

            <input
              placeholder="Phone"
              className="w-full border p-2 rounded"
              value={newResidentPhone}
              onChange={(e) => setNewResidentPhone(e.target.value)}
            />

            <button
              onClick={registerResident}
              className="w-full bg-green-600 text-white py-2 rounded"
            >
              Register Resident
            </button>

            <button
              onClick={() => {
                setShowRegisterModal(false)
                setShowResidentModal(true)
              }}
              className="w-full border py-2 rounded"
            >
              Back
            </button>

          </div>

        </div>
      )}

    </div>
  )
}