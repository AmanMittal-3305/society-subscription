"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("resident");
  const [error, setError] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        email,
        password,
        role,
      });

      if (res.data.success) {
        localStorage.setItem("role", res.data.role);
        localStorage.setItem("token", res.data.token);

        // role-based redirect
        if (res.data.role === "admin") {
            console.log("Logged in as admin");
            
            // router.push("/admin/dashboard");
        }
        else {
            console.log("Logged in as resident");
            
            // router.push("/dashboard");
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex justify-center text-black items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-96">
        <h2 className="text-2xl mb-4">Login</h2>

        <label className="block mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="border p-2 w-full mb-3"
          required
        />

        <label className="block mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="border p-2 w-full mb-3"
          required
        />

        <label className="block mb-3">Login as:</label>
        <select
          value={role}
          onChange={e => setRole(e.target.value)}
          className="border p-2 w-full mb-4"
        >
          <option value="resident">Resident</option>
          <option value="admin">Admin</option>
        </select>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded w-full"
        >
          Login
        </button>
      </form>
    </div>
  );
}