"use client"

import { useEffect, useState } from "react"
import {
  Plus,
  Edit2,
  Trash2,
  Image
} from "lucide-react"
import {
  getFlats,
  createFlat,
  updateFlat,
  deleteFlat as deleteFlatApi,
  restoreFlat as restoreFlatApi,
  getAvailableResidents,
  assignResident,
  registerResidentToFlat,
} from "@/services/adminApi"

export default function FlatsPage() {
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

  const [showImageModal, setShowImageModal] = useState(false)
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [currentImage, setCurrentImage] = useState(0)

  const [newResidentName, setNewResidentName] = useState("")
  const [newResidentEmail, setNewResidentEmail] = useState("")
  const [newResidentPhone, setNewResidentPhone] = useState("")

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const flatImages = [
    "https://www.manglamgroup.com/wp-content/uploads/2024/01/swimmingpool-Corner-Night_cc.jpg",
    "https://www.manglamgroup.com/wp-content/uploads/2024/01/swimmingpool-Corner-Night_cc.jpg",
    "https://www.manglamgroup.com/wp-content/uploads/2024/01/swimmingpool-Corner-Night_cc.jpg",
    "https://www.manglamgroup.com/wp-content/uploads/2024/01/swimmingpool-Corner-Night_cc.jpg",
    "https://www.manglamgroup.com/wp-content/uploads/2024/01/swimmingpool-Corner-Night_cc.jpg"
  ]

  const fetchFlats = async () => {
    try {
      const res = await getFlats(page)
      setFlats(res.data.flats || [])
      setTotalPages(res.data.totalPages || 1)
    } catch (err) {
      console.error(err)
      setFlats([])
    }
  }

  const fetchResidents = async () => {
    try {
      const res = await getAvailableResidents()
      setResidents(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleRestore = async (id: string) => {
    try {
      await restoreFlatApi(id)
      fetchFlats()
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchFlats()
  }, [page])

  const saveFlat = async () => {
    try {
      const data = {
        flat_number: flatNumber,
        owner_name: ownerName,
        flat_type: flatType,
        address
      }

      if (editingId) {
        await updateFlat(editingId, data)
      } else {
        await createFlat(data)
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

  const handleDelete = async (id: string) => {
    try {
      await deleteFlatApi(id)
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

  const handleAssignResident = async () => {
    try {
      await assignResident(selectedFlat, selectedResident)
      setSelectedResident("")
      setShowResidentModal(false)
      fetchFlats()
    } catch (err) {
      console.error(err)
    }
  }

  const handleRegisterResident = async () => {
    try {
      await registerResidentToFlat(selectedFlat, {
        full_name: newResidentName,
        email: newResidentEmail,
        phone_number: newResidentPhone
      })

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

  const openImageModal = () => {
    setSelectedImages(flatImages)
    setCurrentImage(0)
    setShowImageModal(true)
  }

  const nextImage = () => {
    setCurrentImage((prev) =>
      prev === selectedImages.length - 1 ? 0 : prev + 1
    )
  }

  const prevImage = () => {
    setCurrentImage((prev) =>
      prev === 0 ? selectedImages.length - 1 : prev - 1
    )
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

      {showImageModal && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">

          <div className="bg-white p-6 rounded-2xl w-[850px] relative">

            <h2 className="text-2xl font-bold text-center mb-4">
              Flat Images
            </h2>

            <div className="relative flex justify-center items-center">

              <button
                onClick={prevImage}
                className="absolute left-2 bg-white shadow-lg px-4 py-2 rounded-full text-xl"
              >
                ←
              </button>

              <img
                src={selectedImages[currentImage]}
                alt="Flat"
                className="w-full h-[450px] object-cover rounded-xl"
              />

              <button
                onClick={nextImage}
                className="absolute right-2 bg-white shadow-lg px-4 py-2 rounded-full text-xl"
              >
                →
              </button>

            </div>

            <div className="text-center mt-3 text-gray-500">
              {currentImage + 1} / {selectedImages.length}
            </div>

            <div className="flex justify-center gap-3 mt-4 flex-wrap">
              {selectedImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Thumbnail ${index}`}
                  onClick={() => setCurrentImage(index)}
                  className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 ${currentImage === index
                    ? "border-indigo-600"
                    : "border-gray-300"
                    }`}
                />
              ))}
            </div>

            <button
              onClick={() => setShowImageModal(false)}
              className="mt-5 w-full border py-2 rounded-lg"
            >
              Close
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
            <th>Images</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredFlats.map((flat) => (
            <tr
              key={flat.flat_id}
              className={`border-t ${flat.is_active === false ? "opacity-40 bg-gray-100" : ""}`}
            >

              <td className="p-4">{flat.flat_number}</td>
              <td>{flat.owner_name}</td>

              <td>
                {flat.resident_name ? (
                  flat.resident_name
                ) : (
                  <button
                    onClick={() => openResidentModal(flat.flat_id)}
                    disabled={flat.is_active === false}
                    className={`${flat.is_active === false
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-indigo-600"
                      }`}
                  >
                    Add Resident
                  </button>
                )}
              </td>

              <td>{flat.flat_type}</td>
              <td>{flat.address}</td>

              <td>
                <button
                  onClick={openImageModal}
                  className="text-indigo-600"
                >
                  <Image className="w-5 h-5" />
                </button>
              </td>

              <td className="flex gap-2 p-4">
                <button
                  onClick={() => handleEdit(flat)}
                  disabled={flat.is_active === false}
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                {flat.is_active ? (
                  <button onClick={() => handleDelete(flat.flat_id)}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleRestore(flat.flat_id)}
                    className="text-xs text-green-600"
                  >
                    Restore
                  </button>
                )}
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
              onClick={handleAssignResident}
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
              onClick={handleRegisterResident}
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

      <div className="flex justify-center gap-3 mt-6">

        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Previous
        </button>

        <span className="px-4 py-2">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>

      </div>

    </div>
  )
}