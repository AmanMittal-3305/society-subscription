"use client"

import { useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"

export default function LoginPage(){

  const router = useRouter()

  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [error,setError] = useState("")

  const role = "RESIDENT"

  const handleSubmit = async (e:any)=>{
    e.preventDefault()

    try{

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        { email, password, role }
      )

      if(res.data.success){

        localStorage.setItem("token", res.data.token)
        localStorage.setItem("role", res.data.role)

        router.replace("/dashboard")
      }

    }catch(err:any){
      setError(err.response?.data?.message || "Login failed")
    }
  }

  return(
    <form onSubmit={handleSubmit} className="space-y-4">

      <h2 className="text-2xl font-semibold">Resident Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
        className="border p-2 w-full rounded"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
        className="border p-2 w-full rounded"
      />

      {error && <p className="text-red-500">{error}</p>}

      <button className="bg-blue-600 text-white w-full py-2 rounded">
        Login
      </button>

    </form>
  )
}