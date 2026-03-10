"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminProfile() {

  const [user, setUser] = useState<any>(null);

  useEffect(() => {

    const fetchProfile = async () => {

      const token = localStorage.getItem("token");

      try {

        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUser(res.data.user);

      } catch (error) {
        console.log(error);
      }

    };

    fetchProfile();

  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Profile</h2>

      <p><b>Name:</b> {user.full_name}</p>
      <p><b>Email:</b> {user.email}</p>
      <p><b>Phone:</b> {user.phone_number}</p>
      <p><b>Role:</b> {user.role}</p>

    </div>
  );
}