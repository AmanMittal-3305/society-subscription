"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";

export default function SubscriptionDetailPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchDetails();
    }
  }, [id]);

  const fetchDetails = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://localhost:5000/api/resident/subscriptions/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading details...</div>;
  }

  if (!data) {
    return <div className="p-6">No subscription found.</div>;
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="bg-white p-6 rounded-xl shadow border max-w-xl">
        <h1 className="text-2xl font-bold mb-4">
          Subscription Details
        </h1>

        <p>
          Billing Month:{" "}
          {new Date(data.billing_month).toLocaleDateString()}
        </p>

        <p>Amount: ₹{data.amount}</p>

        <p>Status: {data.status}</p>

        <p>Payment Mode: {data.payment_mode || "Pending"}</p>

        <p>
          Payment Date:{" "}
          {data.payment_date
            ? new Date(data.payment_date).toLocaleDateString()
            : "Pending"}
        </p>

        <div className="mt-4">
          <h2 className="font-semibold mb-2">Charge Breakdown</h2>

          <ul className="space-y-2 text-gray-700">
            <li>Maintenance: ₹{data.maintenance || 0}</li>
            <li>Water Charges: ₹{data.water_charge || 0}</li>
            <li>Security Charges: ₹{data.security_charge || 0}</li>
            <li>Other Charges: ₹{data.other_charge || 0}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}