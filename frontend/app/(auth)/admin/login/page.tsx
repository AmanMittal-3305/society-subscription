import Link from "next/link"
import AdminLoginPage from "@/Components/AdminLoginPage"

export default function Page() {

  return (
    <>
      <div className="flex mb-6 bg-gray-200 rounded-lg p-1">

        <Link
          href="/login"
          className="flex-1 text-center py-2 rounded-md"
        >
          Resident Login
        </Link>

        <Link
          href="/admin/login"
          className="flex-1 text-center py-2 bg-white shadow rounded-md"
        >
          Admin Login
        </Link>

      </div>

      <AdminLoginPage />
    </>
  )
}