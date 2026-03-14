"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import LoginLayout from "@/app/Components/LoginLayout";

export default function AdminLoginPage() {

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const role = "ADMIN"

  const handleSubmit = async (e: any) => {

    e.preventDefault();
    setError("");

    try {

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        {
          email,
          password,
          role
        }
      )

      if (res.data.success) {

        localStorage.setItem("role", res.data.role)
        localStorage.setItem("token", res.data.token)

        router.push("/admin/dashboard")

      }

    } catch (err: any) {

      setError(
        err.response?.data?.message || "Login failed"
      )

    }

  }

  return (

    <LoginLayout active="ADMIN">


      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >

        <h2 className="text-2xl font-semibold">
          Admin Login
        </h2>


        <div>

          <label className="block text-sm mb-1">
            Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

        </div>


        <div>

          <label className="block text-sm mb-1">
            Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

        </div>


        {error && (
          <p className="text-red-500 text-sm">
            {error}
          </p>
        )}


        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Login
        </button>

      </form>
    </LoginLayout>
  )

}